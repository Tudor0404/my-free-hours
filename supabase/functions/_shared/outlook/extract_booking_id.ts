export default function export_booking_id(
  id: string | undefined | null,
): string {
  return id && id.startsWith("MyFreeHours:")
    ? id.replace("MyFreeHours:", "")
    : "";
}
