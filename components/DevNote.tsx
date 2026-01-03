export default function DevNote() {
  return (
    <section className="py-10">
      <div className="mx-auto max-w-5xl px-6">
        <div className="mx-auto max-w-3xl">
          <div
            className="
        rounded-xl
        border border-border
        bg-card
        p-6
        text-sm
        text-muted-foreground
        space-y-4
      "
          >
            <h3 className="text-base font-semibold text-foreground">
              Dev Note 🧪
            </h3>

            {/* oh god i hate prettier wtf is this TwT  */}
            <p>
              Hey, I'm{" "}
              <a
                href="https://github.com/pratiksingh94"
                target="_blank"
                className="text-primary underline underline-offset-4"
              >
                Pratik
              </a>
              . I built <strong className="text-foreground">CSPLens</strong> as
              part of{" "}
              <a
                href="https://flavortown.hackclub.com/"
                target="_blank"
                className="text-primary underline underline-offset-4"
              >
                Flavortown 2025 by Hack Club
              </a>
              , though the idea was in my head for a while.
            </p>

            <p>
              This project is still under active development. Stuff will change,
              and new things will appear whenever I feel like 🐱
            </p>

            <p>
              If you're interested, check out the GitHub repo for future plans,
              upcoming features, or try contributing if you want to, PRs are
              always welcome.
            </p>

            <div className="flex flex-col gap-2 pt-2">
              <a
                href="https://github.com/pratiksingh94/csplens"
                target="_blank"
                className="text-primary underline underline-offset-4"
              >
                → View on GitHub
              </a>

              <a
                href="https://flavortown.hackclub.com/projects/2679"
                target="_blank"
                className="text-primary underline underline-offset-4"
              >
                → View on Flavortown
              </a>

              <a
                href="https://blog.pratiksingh.xyz"
                target="_blank"
                className="text-primary underline underline-offset-4"
              >
                → Read about CSP & CSPLens (coming soon)
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
