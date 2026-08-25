/*
 * Compatibility entrypoint for older integrations that referenced /sw-push.js.
 * The production application registers /sw.js, where push and notification-click
 * handling now live alongside the main offline/runtime caching strategy.
 */
importScripts("/sw.js");
