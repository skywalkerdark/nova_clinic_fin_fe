import { redirect } from "next/navigation";

export default function SettingsPage() {
    // Автоматически кидаем на первую вкладку при входе в настройки
    redirect("/settings/payment-methods");
}
