import IMPORTANT_DIRECTIVES from "@/lib/missing-directives";

// derive from the list
const IMPORTANT_SET = new Set(IMPORTANT_DIRECTIVES.map((d) => d.directive));

// metadata
export type DirectiveInfo = {
  name: string;
  description: string;
  icon: string;
  boolean?: boolean;
};

export const CSP_DIRECTIVES: DirectiveInfo[] = [
  {
    name: "default-src",
    description: "Fallback for other fetch directives",
    icon: "Shield",
  },
  {
    name: "script-src",
    description: "valid source for JavaScript",
    icon: "Code",
  },
  {
    name: "style-src",
    description: "Valid source for stylesheets",
    icon: "Palette",
  },
  {
    name: "img-src",
    description: "Valid sources for images",
    icon: "Image",
  },
  {
    name: "connect-src",
    description: "Valid targets for fetch, WebSocket, etc",
    icon: "Wifi",
  },
  {
    name: "font-src",
    description: "Valid sources for font",
    icon: "Type",
  },
  {
    name: "media-src",
    description: "Valid sources for media",
    icon: "Video",
  },
  {
    name: "object-src",
    description: "Valid sources for plugins",
    icon: "Box",
  },
  {
    name: "frame-src",
    description: "Valid sources for frames",
    icon: "Frame",
  },
  {
    name: "frame-ancestors",
    description: "Valid parents for embedding",
    icon: "Layers",
  },
  {
    name: "worker-src",
    description: "Valid sources for workers",
    icon: "Cpu",
  },
  {
    name: "manifest-src",
    description: "Valid sources for manifests",
    icon: "FileJson",
  },
  {
    name: "base-uri",
    description: "Valid base URLs for document",
    icon: "Link",
  },
  {
    name: "form-action",
    description: "Valid targets for form submissions",
    icon: "Send",
  },
  {
    name: "upgrade-insecure-requests",
    description: "Upgrade HTTP to HTTPS",
    icon: "Lock",
    boolean: true,
  },
  {
    name: "block-all-mixed-content",
    description: "Block mixed HTTP/HTTPS conent",
    icon: "Ban",
    boolean: true,
  },
];

export const isDirectiveImportant = (directive: string) =>
  IMPORTANT_SET.has(directive);

export const POLICY_PRESET = {
  strict: {
    name: "Strict",
    description: "Maximum security, minimal compatibility",
    directives: {
      "default-src": ["'none'"],
      "script-src": ["'self'"],
      "style-src": ["'self'"],
      "img-src": ["'self'"],
      "connect-src": ["'self'"],
      "font-src": ["'self'"],
      "object-src": ["'none'"],
      "frame-ancestors": ["'none'"],
      "base-uri": ["'self'"],
      "form-action": ["'self'"],
    },
  },
  balanced: {
    name: "Balanced",
    description: "Good security with practical compatibility",
    directives: {
      "default-src": ["'self'"],
      "script-src": ["'self'"],
      "style-src": ["'self'", "'unsafe-inline'"],
      "img-src": ["'self'", "data:", "https:"],
      "connect-src": ["'self'"],
      "font-src": ["'self'"],
      "object-src": ["'none'"],
      "frame-ancestors": ["'self'"],
      "base-uri": ["'self'"],
      "form-action": ["'self'"],
    },
  },
  legacy: {
    name: "Legacy",
    description: "Compatible with older browsers (LESS SECURE!)",
    directives: {
      "default-src": ["*"],
      "script-src": ["*", "'unsafe-inline'", "'unsafe-eval'"],
      "style-src": ["*", "'unsafe-inline'"],
      "img-src": ["*", "data:"],
      "connect-src": ["*"],
      "font-src": ["*"],
      "object-src": ["*"],
      "frame-ancestors": ["*"],
    },
  },
  api: {
    name: "API Only",
    description: "For API endpoints with no UI",
    directives: {
      "default-src": ["'none'"],
      "frame-ancestors": ["'none'"],
      "base-uri": ["'none'"],
      "form-action": ["'none'"],
    },
  },
} as const;

export type PolicyPreset = keyof typeof POLICY_PRESET;
