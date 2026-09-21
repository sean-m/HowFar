const outputDirectory = new URL('../dist/', import.meta.url);
const sourceHtml = new URL('../index.html', import.meta.url);
const outputHtml = new URL('../dist/index.html', import.meta.url);
const sourceEntry = new URL('../src/main.ts', import.meta.url);
const outputBundle = new URL('../dist/app.js', import.meta.url);

await Deno.remove(outputDirectory, { recursive: true }).catch((error: unknown) => {
  if (!(error instanceof Deno.errors.NotFound)) {
    throw error;
  }
});
await Deno.mkdir(outputDirectory);
await Deno.copyFile(sourceHtml, outputHtml);

const bundle = await new Deno.Command(Deno.execPath(), {
  args: ['bundle', sourceEntry.pathname, '--output', outputBundle.pathname],
}).output();

if (!bundle.success) {
  await Deno.stderr.write(bundle.stderr);
  Deno.exit(bundle.code);
}
