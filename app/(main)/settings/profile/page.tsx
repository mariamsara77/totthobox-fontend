"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import { ApiError } from "@/lib/api-client";
import { FiCamera, FiX } from "react-icons/fi";
import {
  getProfile,
  updateProfile,
  getAvailableRoles,
  getDivisions,
  getDistricts,
  getThanas,
  getClassLevels,
  removeAvatar,
  removeRole,
} from "@/lib/profile";
import type { UserProfile, SelectOption } from "@/types/profile";

export default function ProfileSettingsPage() {
  const { mutateUser } = useAuth();

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [roles, setRoles] = useState<string[]>([]);
  const [divisions, setDivisions] = useState<SelectOption[]>([]);
  const [districts, setDistricts] = useState<SelectOption[]>([]);
  const [thanas, setThanas] = useState<SelectOption[]>([]);
  const [classLevels, setClassLevels] = useState<SelectOption[]>([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    profession: "",
    bio: "",
    location: "",
    division_id: "",
    district_id: "",
    thana_id: "",
    class_level_id: "",
    selected_role: "user",
  });

  // ── Load initial data ─────────────────────────────────────────────────
  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [p, r, d, cl] = await Promise.all([
        getProfile(),
        getAvailableRoles(),
        getDivisions(),
        getClassLevels(),
      ]);

      setProfile(p);
      setRoles(r);
      setDivisions(d);
      setClassLevels(cl);

      setForm({
        name: p.name ?? "",
        email: p.email ?? "",
        profession: p.profession ?? "",
        bio: p.bio ?? "",
        location: p.location ?? "",
        division_id: p.division_id?.toString() ?? "",
        district_id: p.district_id?.toString() ?? "",
        thana_id: p.thana_id?.toString() ?? "",
        class_level_id: p.class_level_id?.toString() ?? "",
        selected_role: p.selected_role ?? "user",
      });

      if (p.division_id) {
        const dist = await getDistricts(p.division_id);
        setDistricts(dist);
      }
      if (p.district_id) {
        const th = await getThanas(p.district_id);
        setThanas(th);
      }
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "ডাটা লোড করতে ব্যর্থ।");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // ── Cascade handlers ──────────────────────────────────────────────────
  const handleDivisionChange = async (value: string) => {
    setForm((f) => ({
      ...f,
      division_id: value,
      district_id: "",
      thana_id: "",
    }));
    setDistricts([]);
    setThanas([]);

    if (value) {
      try {
        const dist = await getDistricts(Number(value));
        setDistricts(dist);
      } catch {
        // silent
      }
    }
  };

  const handleDistrictChange = async (value: string) => {
    setForm((f) => ({ ...f, district_id: value, thana_id: "" }));
    setThanas([]);

    if (value) {
      try {
        const th = await getThanas(Number(value));
        setThanas(th);
      } catch {
        // silent
      }
    }
  };

  // ── Avatar preview ────────────────────────────────────────────────────
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setAvatarFile(file);
    if (file) {
      setAvatarPreview(URL.createObjectURL(file));
    } else {
      setAvatarPreview(null);
    }
  };

  // ── Submit ────────────────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const payload = new FormData();
      payload.append("name", form.name);
      payload.append("email", form.email);
      payload.append("profession", form.profession);
      payload.append("bio", form.bio);
      payload.append("location", form.location);
      payload.append("selected_role", form.selected_role);

      if (form.division_id) payload.append("division_id", form.division_id);
      if (form.district_id) payload.append("district_id", form.district_id);
      if (form.thana_id) payload.append("thana_id", form.thana_id);
      if (form.class_level_id)
        payload.append("class_level_id", form.class_level_id);
      if (avatarFile) payload.append("avatar", avatarFile);

      const res = await updateProfile(payload);

      setProfile(res.user);
      setAvatarFile(null);
      setAvatarPreview(null);
      setSuccess("তথ্য সফলভাবে সংরক্ষিত হয়েছে।");

      // AuthContext এর user আপডেট করো (নাম/অ্যাভাটার চেঞ্জ হলে)
      await mutateUser();
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError("কিছু একটা ভুল হয়েছে।");
      }
    } finally {
      setSaving(false);
    }
  };

  // ── Remove avatar ─────────────────────────────────────────────────────
  const handleRemoveAvatar = async () => {
    try {
      await removeAvatar();
      setAvatarFile(null);
      setAvatarPreview(null);
      if (profile) {
        setProfile({ ...profile, avatar_url: "" });
      }
      await mutateUser();
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : "অ্যাভাটার মুছতে ব্যর্থ।",
      );
    }
  };

  // ── Remove role ───────────────────────────────────────────────────────
  const handleRemoveRole = async () => {
    try {
      const res = await removeRole();
      setForm((f) => ({ ...f, selected_role: "user" }));
      setProfile(res.user);
      setSuccess("রোল রিমুভ করা হয়েছে।");
      await mutateUser();
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : "রোল রিমুভ করতে ব্যর্থ।",
      );
    }
  };

  //   if (loading) {
  //     return (
  //       <section className="max-w-2xl mx-auto p-4 space-y-8 animate-pulse">
  //         {/* Title */}
  //         <div className="h-8 w-48 bg-zinc-400/25 rounded-lg mb-6" />

  //         {/* Avatar Section */}
  //         <div className="space-y-2">
  //           <div className="h-4 w-24 bg-zinc-400/25 rounded" />
  //           <div className="flex items-center gap-6">
  //             <div className="size-20 bg-zinc-400/25 rounded-xl shrink-0" />
  //             <div className="flex-1 space-y-2">
  //               <div className="h-9 w-full bg-zinc-400/10 rounded-lg" />
  //               <div className="h-3 w-20 bg-zinc-400/25 rounded" />
  //             </div>
  //           </div>
  //         </div>

  //         <div className="h-px w-full bg-zinc-400/10" />

  //         {/* Inputs (Name, Email, Profession) */}
  //         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
  //           <div className="space-y-2">
  //             <div className="h-4 w-24 bg-zinc-400/25 rounded" />
  //             <div className="h-10 w-full bg-zinc-400/10 rounded-lg" />
  //           </div>
  //           <div className="space-y-2">
  //             <div className="h-4 w-28 bg-zinc-400/25 rounded" />
  //             <div className="h-10 w-full bg-zinc-400/10 rounded-lg" />
  //           </div>
  //           <div className="space-y-2">
  //             <div className="h-4 w-16 bg-zinc-400/25 rounded" />
  //             <div className="h-10 w-full bg-zinc-400/10 rounded-lg" />
  //           </div>
  //         </div>

  //         {/* Bio */}
  //         <div className="space-y-2">
  //           <div className="h-4 w-32 bg-zinc-400/25 rounded" />
  //           <div className="h-24 w-full bg-zinc-400/10 rounded-lg" />
  //         </div>

  //         {/* Location */}
  //         <div className="space-y-2">
  //           <div className="h-4 w-16 bg-zinc-400/25 rounded" />
  //           <div className="h-10 w-full bg-zinc-400/10 rounded-lg" />
  //         </div>

  //         <div className="h-px w-full bg-zinc-400/10" />

  //         {/* Cascading Selects (Division, District, Thana) */}
  //         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
  //           <div className="space-y-2">
  //             <div className="h-4 w-16 bg-zinc-400/25 rounded" />
  //             <div className="h-10 w-full bg-zinc-400/10 rounded-lg" />
  //           </div>
  //           <div className="space-y-2">
  //             <div className="h-4 w-12 bg-zinc-400/25 rounded" />
  //             <div className="h-10 w-full bg-zinc-400/10 rounded-lg" />
  //           </div>
  //           <div className="space-y-2">
  //             <div className="h-4 w-14 bg-zinc-400/25 rounded" />
  //             <div className="h-10 w-full bg-zinc-400/10 rounded-lg" />
  //           </div>
  //         </div>

  //         {/* Submit Button */}
  //         <div className="pt-4">
  //           <div className="h-10 w-32 bg-zinc-400/25 rounded-lg" />
  //         </div>
  //       </section>
  //     );
  //   }

  return (
    <section className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">প্রোফাইল সেটিংস</h1>

      {error && (
        <div className="mb-4 p-3 rounded-lg bg-zinc-400/10 text-red-600 text-sm">
          {error}
        </div>
      )}
      {success && (
        <div className="mb-4 p-3 rounded-lg bg-zinc-400/10 text-green-600 text-sm">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Avatar Section */}
        <div>
          <label className="block text-sm font-medium mb-2">প্রোফাইল ছবি</label>

          <div className="relative size-24">
            {/* Profile Image */}
            <img
              src={
                avatarPreview ||
                profile?.avatar_url ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(form.name)}&background=EBF4FF&color=7F9CF5`
              }
              alt="Avatar"
              className="size-24 rounded-2xl object-cover"
            />

            {/* Change Photo Badge (Bottom-Right) */}
            <label
              htmlFor="avatar-upload"
              className="absolute -bottom-1.5 -right-1.5 p-2 bg-zinc-400/25 rounded-xl hover:bg-zinc-400/50 border border-zinc-400/25"
              title="ছবি পরিবর্তন করুন"
            >
              <FiCamera className="size-4" />
            </label>

            {/* Remove Photo Badge (Top-Right) */}
            {(avatarFile || profile?.avatar_url) && (
              <button
                type="button"
                onClick={handleRemoveAvatar}
                className="absolute -top-1.5 -right-1.5 p-1 bg-red-600 text-white rounded-xl shadow-md hover:bg-red-700 active:scale-95 transition"
                title="ছবি মুছে ফেলুন"
              >
                <FiX className="size-3.5" />
              </button>
            )}
          </div>

          <input
            id="avatar-upload"
            type="file"
            accept="image/*"
            onChange={handleAvatarChange}
            className="hidden"
          />
        </div>

        <hr className="border-zinc-400/10" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-1">
              সম্পূর্ণ নাম *
            </label>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full rounded-xl px-4 py-2.5 outline-none bg-zinc-400/10 focus:ring-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">ইমেইল *</label>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full rounded-xl px-4 py-2.5 outline-none bg-zinc-400/10 focus:ring-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">পেশা</label>
            <input
              type="text"
              value={form.profession}
              onChange={(e) => setForm({ ...form, profession: e.target.value })}
              className="w-full rounded-xl px-4 py-2.5 outline-none bg-zinc-400/10 focus:ring-2"
            />
          </div>
        </div>

        {/* Bio */}
        <div>
          <label className="block text-sm font-medium mb-1">
            নিজের সম্পর্কে
          </label>
          <textarea
            rows={4}
            value={form.bio}
            onChange={(e) => setForm({ ...form, bio: e.target.value })}
            className="w-full rounded-xl px-4 py-2.5 outline-none bg-zinc-400/10 focus:ring-2 resize-none"
          />
        </div>

        {/* Location text */}
        <div>
          <label className="block text-sm font-medium mb-1">ঠিকানা</label>
          <input
            type="text"
            value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
            className="w-full rounded-xl px-4 py-2.5 outline-none bg-zinc-400/10 focus:ring-2"
          />
        </div>

        <hr className="border-zinc-400/10" />

        {/* Division / District / Thana */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium mb-1">বিভাগ</label>
            <select
              value={form.division_id}
              onChange={(e) => handleDivisionChange(e.target.value)}
              className="w-full rounded-xl px-4 py-2.5 outline-none bg-zinc-200 dark:bg-zinc-700 focus:ring-2"
            >
              <option value="">নির্বাচন করুন</option>
              {divisions.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">জেলা</label>
            <select
              value={form.district_id}
              onChange={(e) => handleDistrictChange(e.target.value)}
              disabled={!form.division_id}
              className="w-full rounded-xl px-4 py-2.5 outline-none bg-zinc-200 dark:bg-zinc-700 focus:ring-2 disabled:opacity-50"
            >
              <option value="">নির্বাচন করুন</option>
              {districts.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">থানা</label>
            <select
              value={form.thana_id}
              onChange={(e) => setForm({ ...form, thana_id: e.target.value })}
              disabled={!form.district_id}
              className="w-full rounded-xl px-4 py-2.5 outline-none bg-zinc-200 dark:bg-zinc-700 focus:ring-2 disabled:opacity-50"
            >
              <option value="">নির্বাচন করুন</option>
              {thanas.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="pt-4">
          <button
            type="submit"
            disabled={saving}
            className="px-4 py-2.5 bg-zinc-400/10 hover:bg-zinc-400/25 rounded-xl text-sm font-medium disabled:opacity-60"
          >
            {saving ? "সংরক্ষণ হচ্ছে..." : "সংরক্ষণ করুন"}
          </button>
        </div>
      </form>
    </section>
  );
}
