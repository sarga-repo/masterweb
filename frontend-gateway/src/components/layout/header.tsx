import { HeaderClient } from "@/components/layout/header-client";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { getRequestLocale } from "@/lib/i18n/request";
import { getGatewayNavigation } from "@/lib/navigation/gateway-navigation";

export async function Header() {
  const locale = await getRequestLocale();
  const [navigation, dictionary] = await Promise.all([
    getGatewayNavigation(locale),
    Promise.resolve(getDictionary(locale)),
  ]);

  return (
    <HeaderClient
      locale={locale}
      items={navigation.items}
      dictionary={dictionary}
      navigationSource={navigation.source}
    />
  );
}
