// src/app/settings/[...not-found]/page.tsx
import { notFound } from "next/navigation";

export default function NotFoundCatchAll() {
    notFound(); // Перехватывает все ненайденные URL внутри /settings и отдает локальный not-found.tsx
}
