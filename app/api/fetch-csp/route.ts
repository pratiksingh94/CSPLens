import { NextRequest, NextResponse } from "next/server";

const isPrivateIP = (host: string) => {
  return (
    host === "localhost" ||
    host.startsWith("127.") ||
    host.startsWith("10.") ||
    host.startsWith("192.168")
  );
};

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json();

    if (!url || typeof url !== "string") {
      return NextResponse.json(
        {
          error: "Invalid URL",
        },
        { status: 400 },
      );
    }

    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      return NextResponse.json(
        { error: "Only http/https URLs allowed" },
        { status: 400 },
      );
    }

    let parsed: URL;
    try {
      parsed = new URL(url);
    } catch {
      return NextResponse.json(
        { error: "Invalid URL format" },
        { status: 403 },
      );
    }

    if (isPrivateIP(parsed.hostname)) {
      return NextResponse.json(
        { error: "Private/Internal address not allowed, dont even try." },
        { status: 403 },
      );
    }

    let res: Response;

    try {
      res = await fetch(parsed.toString(), {
        method: "GET",
        redirect: "manual",
      });
    } catch (err: any) {
      const code = err?.cause?.code;

      if (code === "ENOTFOUND") {
        return NextResponse.json(
          { error: "Domain does not exist or cannot be resolved" },
          { status: 400 },
        );
      }

      if (code === "ECONNREFUSED" || code === "ETIMEDOUT") {
        return NextResponse.json(
          { error: "Target server is unreachable" },
          { status: 400 },
        );
      }

      return NextResponse.json(
        { error: "Failed to connect to target URL" },
        { status: 400 },
      );
    }

    const csp =
      res.headers.get("content-security-policy") ??
      res.headers.get("content-security-policy-report-only");

    if (!csp) {
      return NextResponse.json(
        { error: "No CSP header found" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      csp,
      reportOnly: !res.headers.get("content-security-policy"),
    });
  } catch (err) {
    console.log(err);
    return NextResponse.json({ error: "Failed to fetch CSP" }, { status: 500 });
  }
}
