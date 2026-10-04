import { DEFAULT_CONTENT } from "@/config/defaults";
import { getPublishedDocument } from "@/services/content";
import FooterView from "./FooterView";

// Public footer: published settings (Next cache). The admin renders FooterView itself with
// the latest settings and wraps it in an editor.
export default async function SiteFooter() {
  const settings = await getPublishedDocument("settings");
  return <FooterView lines={settings?.data.footerLines ?? DEFAULT_CONTENT.settings.data.footerLines} />;
}
