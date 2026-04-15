import { ALL_DOC_PAGES } from '@/lib/docs'
import { Callout } from '@/components/docs/Callout'
import { CodeBlock } from '@/components/docs/CodeBlock'

const meta = ALL_DOC_PAGES.find((p) => p.href === '/docs/embedding')!

export default function EmbeddingPage() {
  return (
    <article data-docs-content>
      <div className="flex items-center justify-between mb-4 text-sm text-gray-400">
        <span>{meta.readTime}</span>
        <span>{meta.lastUpdated}</span>
      </div>

      <h1 className="text-3xl font-bold text-[#1A1035] dark:text-white mb-3">Embedding</h1>
      <p className="text-lg text-gray-500 dark:text-gray-400 mb-10 leading-relaxed">
        Add your BotForge chat widget to any website in just a few minutes.
      </p>

      <h2 id="get-your-embed-code" className="text-xl font-semibold text-[#1A1035] dark:text-white mt-10 mb-3 scroll-mt-20">Get your embed code</h2>
      <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
        Each bot has a unique embed snippet. To find it:
      </p>
      <ol className="space-y-2 list-decimal list-inside text-gray-600 dark:text-gray-400 mb-4">
        <li>Go to your <strong>Dashboard</strong> and open the bot you want to embed.</li>
        <li>Click the <strong>Embed</strong> tab at the top of the bot page.</li>
        <li>Click <strong>Copy snippet</strong> to copy the code to your clipboard.</li>
      </ol>
      <p className="text-gray-600 dark:text-gray-400 mb-2">Your snippet will look like this:</p>
      <CodeBlock language="html" code={`<script
  src="https://botforge.io/widget.js"
  data-bot-id="bot_abc123xyz"
  async
></script>`} />

      <h2 id="html-sites" className="text-xl font-semibold text-[#1A1035] dark:text-white mt-10 mb-3 scroll-mt-20">Adding to any HTML site</h2>
      <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
        Paste the snippet just before the closing{' '}
        <code className="bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded text-sm font-mono">&lt;/body&gt;</code>{' '}
        tag in your HTML file.
      </p>
      <CodeBlock language="html" code={`  <!-- your existing content -->

  <script
    src="https://botforge.io/widget.js"
    data-bot-id="bot_abc123xyz"
    async
  ></script>
</body>
</html>`} />
      <Callout variant="tip">
        Add the snippet to every page where you want the widget. If you use a shared footer or template file, adding it once there is sufficient.
      </Callout>

      <h2 id="wordpress" className="text-xl font-semibold text-[#1A1035] dark:text-white mt-10 mb-3 scroll-mt-20">WordPress</h2>
      <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">Two options:</p>
      <div className="space-y-5">
        <div>
          <h3 className="font-semibold text-[#1A1035] dark:text-white mb-2">Option A — Theme editor (recommended)</h3>
          <ol className="space-y-1 list-decimal list-inside text-sm text-gray-600 dark:text-gray-400">
            <li>In WordPress admin, go to <strong>Appearance → Theme File Editor</strong>.</li>
            <li>Select <strong>footer.php</strong> from the file list on the right.</li>
            <li>Paste the snippet just before the <code className="bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded">&lt;/body&gt;</code> tag.</li>
            <li>Click <strong>Update File</strong>.</li>
          </ol>
        </div>
        <div>
          <h3 className="font-semibold text-[#1A1035] dark:text-white mb-2">Option B — Footer widget</h3>
          <ol className="space-y-1 list-decimal list-inside text-sm text-gray-600 dark:text-gray-400">
            <li>Go to <strong>Appearance → Widgets</strong>.</li>
            <li>Add a <strong>Custom HTML</strong> widget to the Footer area.</li>
            <li>Paste the snippet and click <strong>Save</strong>.</li>
          </ol>
        </div>
      </div>

      <h2 id="webflow" className="text-xl font-semibold text-[#1A1035] dark:text-white mt-10 mb-3 scroll-mt-20">Webflow</h2>
      <ol className="space-y-2 list-decimal list-inside text-gray-600 dark:text-gray-400 mb-4">
        <li>Open your project in the Webflow Designer.</li>
        <li>Click the <strong>Pages</strong> icon and select the page (or use site-wide settings).</li>
        <li>Click the gear icon to open <strong>Page Settings</strong>.</li>
        <li>Scroll to <strong>Custom Code → Footer Code</strong>, paste the snippet, and click <strong>Save</strong>.</li>
        <li>Publish your site for the change to go live.</li>
      </ol>
      <Callout variant="tip">
        To add the widget to all pages at once, use <strong>Site Settings → Custom Code</strong> instead of individual page settings.
      </Callout>

      <h2 id="performance" className="text-xl font-semibold text-[#1A1035] dark:text-white mt-10 mb-3 scroll-mt-20">Performance &amp; page speed</h2>
      <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
        The widget script loads <strong>asynchronously</strong> (via the <code className="bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded text-sm font-mono">async</code> attribute). The browser does not wait for it before rendering your page — your Core Web Vitals and page speed scores are unaffected. The widget appears in the bottom corner a moment after the rest of your page has loaded.
      </p>
    </article>
  )
}
