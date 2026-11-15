// scripts/verify-auth.mjs
// Automated verification for Social Login & Profile Menu functionality

import { chromium } from "playwright";

const BASE_URL = process.env.BASE_URL || "http://localhost:3000";

async function runAuthVerification() {
  console.log(`Starting Auth Verification against ${BASE_URL}...`);
  const browser = await chromium.launch({ headless: true });
  let exitCode = 0;

  try {
    const context = await browser.newContext({
      userAgent:
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    });
    const page = await context.newPage();

    // ── Scenario 1: Verify Login Page Buttons & No False "Not Configured" ──
    console.log("\n[Scenario 1] Checking Login Page OAuth buttons...");
    await page.goto(`${BASE_URL}/login`, { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(1000);

    const pageContent = await page.content();
    const hasGoogleButton = pageContent.includes("Google দিয়ে সাইন ইন করুন");
    const hasGithubButton = pageContent.includes("GitHub দিয়ে সাইন ইন করুন");
    const hasFalseGoogleWarning = pageContent.includes("Google লগইন বর্তমানে কনফিগার করা নেই");

    console.log(" - Google Sign-In button present:", hasGoogleButton);
    console.log(" - GitHub Sign-In button present:", hasGithubButton);
    console.log(" - False 'Google not configured' warning displayed:", hasFalseGoogleWarning);

    if (!hasGoogleButton || !hasGithubButton) {
      throw new Error("OAuth login buttons were not rendered on /login.");
    }

    if (hasFalseGoogleWarning) {
      throw new Error("False 'Google লগইন বর্তমানে কনফিগার করা নেই' message appeared despite client ID being set.");
    }
    console.log("✓ Scenario 1 Passed: Buttons visible, no false unconfigured warning.");

    // ── Scenario 2: Simulate GitHub OAuth callback & ProfileMenu update ──
    console.log("\n[Scenario 2] Simulating GitHub OAuth callback via BroadcastChannel/postMessage...");
    let currentUser = null;

    // Route interception for auth APIs
    await page.route("**/api/auth/me", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ user: currentUser }),
      });
    });

    await page.route("**/api/auth/github", async (route) => {
      const postData = route.request().postDataJSON();
      if (!postData?.code) {
        return route.fulfill({
          status: 400,
          contentType: "application/json",
          body: JSON.stringify({ message: "Code required" }),
        });
      }
      currentUser = {
        id: 1234,
        name: "Rahim Ahmed",
        email: "rahim@example.com",
        avatar_url: "https://ui-avatars.com/api/?name=Rahim+Ahmed",
        slug: "rahim-ahmed",
      };
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ user: currentUser, success: true }),
      });
    });

    // Navigate to homepage where ProfileMenu is visible
    await page.goto(`${BASE_URL}/`, { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(800);

    // Verify initially logged out
    const initialText = await page.textContent("body");
    console.log(" - Initial page contains 'লগইন' button:", initialText.includes("লগইন"));

    // Open login modal to simulate clicking GitHub login
    await page.evaluate(() => {
      // Simulate OAuth success message event as dispatched by /auth/github/callback
      window.postMessage(
        {
          type: "github-auth-success",
          code: "test-github-code-xyz",
          state: null,
          timestamp: Date.now(),
        },
        window.location.origin,
      );

      // Also trigger BroadcastChannel
      try {
        const bc = new BroadcastChannel("totthobox-auth");
        bc.postMessage({
          type: "github-auth-success",
          code: "test-github-code-xyz",
          state: null,
          timestamp: Date.now(),
        });
        bc.close();
      } catch {}
    });

    // In a real click, GithubLoginButton calls /api/auth/github.
    // Let's call /api/auth/github directly from page to test AuthContext mutate & ProfileMenu reactivity
    await page.evaluate(async () => {
      const res = await fetch("/api/auth/github", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: "test-github-code-xyz" }),
      });
      const data = await res.json();
      // Dispatch sync event
      const bc = new BroadcastChannel("totthobox-auth");
      bc.postMessage({ type: "auth-sync", action: "login" });
      bc.close();
    });

    await page.waitForTimeout(1000);

    // ProfileMenu should now show Rahim Ahmed's avatar
    const loggedInContent = await page.content();
    const hasUserAvatar = loggedInContent.includes("Rahim Ahmed");
    console.log(" - ProfileMenu rendered user 'Rahim Ahmed':", hasUserAvatar);

    if (!hasUserAvatar) {
      throw new Error("ProfileMenu did not update after simulated login.");
    }
    console.log("✓ Scenario 2 Passed: ProfileMenu reactive update succeeded.");

    // ── Scenario 3: Null safety test for GitHub user with name: null ──
    console.log("\n[Scenario 3] Testing GitHub user with null name & null avatar...");
    currentUser = {
      id: 5678,
      name: null,
      email: "gituser@domain.com",
      avatar_url: null,
      slug: "octodev",
    };

    await page.evaluate(() => {
      const bc = new BroadcastChannel("totthobox-auth");
      bc.postMessage({ type: "auth-sync", action: "login" });
      bc.close();
    });

    await page.waitForTimeout(800);

    const nullUserContent = await page.content();
    const hasSlugFallback = nullUserContent.includes("octodev");
    console.log(" - Fallback slug displayed for null-name user:", hasSlugFallback);

    if (!hasSlugFallback) {
      throw new Error("Fallback display name was not rendered for user with null name.");
    }
    console.log("✓ Scenario 3 Passed: Null name safety handled gracefully.");

    // ── Scenario 4: Logout Flow ──
    console.log("\n[Scenario 4] Testing logout flow...");
    await page.route("**/api/auth/logout", async (route) => {
      currentUser = null;
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ success: true }),
      });
    });

    await page.evaluate(async () => {
      await fetch("/api/auth/logout", { method: "POST" });
      const bc = new BroadcastChannel("totthobox-auth");
      bc.postMessage({ type: "auth-sync", action: "logout" });
      bc.close();
    });

    await page.waitForTimeout(800);

    const loggedOutContent = await page.content();
    const backToLoginButton = loggedOutContent.includes("লগইন");
    console.log(" - User logged out, 'লগইন' button restored:", backToLoginButton);

    if (!backToLoginButton) {
      throw new Error("Login button did not restore after logout.");
    }
    console.log("✓ Scenario 4 Passed: Logout successfully cleared session.");

    console.log("\n=========================================");
    console.log("ALL AUTH VERIFICATION SCENARIOS PASSED!");
    console.log("=========================================\n");
  } catch (err) {
    console.error("\n❌ Auth Verification FAILED:", err.message);
    exitCode = 1;
  } finally {
    await browser.close();
  }

  process.exit(exitCode);
}

runAuthVerification();
