# Rylo barber website

Public page: /rylo-barber/
Private booking inbox: /rylo-barber/inbox.html

## Booking demo

The owner approved demo data. Kai, Ren and Tayo are sample barbers. Haircuts take 30 minutes, beard tidies 20 minutes, and combined visits 50 minutes. Demo hours are Tuesday to Saturday 09:00 to 18:00 and Sunday 10:00 to 15:00. Mondays are closed. Times use Africa/Harare (UTC+2). Starts are hourly, with each visit reserving that hour. Some sample times are unavailable to show the experience.

Visitors choose a service, barber and available time, add details, then receive a saved demo ticket and completion toast. Tickets can be downloaded. No payment, real appointment, email or WhatsApp alert is created. The whole flow is labelled as a demo.

Demo bookings are stored in the existing private inbox. A separate encrypted hold for each barber and start time prevents the same slot being booked twice. Cancelling or deleting a demo booking releases its hold. Repeated submissions with the same request ID return the same saved ticket.

## On-device history

The last 30 tickets are kept in localStorage on the customer's device. These records contain service, barber, date, time and reference, but no name or phone number. Ticket status is a saved snapshot, not a live account.

Remembering a name and phone number requires the separate unchecked opt-in. Customers can forget saved details and clear history. Shared devices are called out in the form. If browser storage is blocked or full, booking still works and the customer can download the ticket. There is no cross-device account or tracking cookie.

## Storage and access

The inbox uses the existing builder passcode and keeps it only in memory. The API uses BLOB_READ_WRITE_TOKEN, BUILDER_API_KEY and BUILDER_AI_PASSCODE on the server. Customer details and slot holds are encrypted before saving. Do not rotate BUILDER_API_KEY without migrating the encrypted records.

The public availability response contains only demo staff, service lengths, dates and free times. It does not expose customer records. Old request records stay readable in the inbox. Availability and hours are demo rules in builder/rylo-schedule.js. Real scheduling must be configured and reviewed before taking real appointments.

## Images

The hero and three haircut portraits are matching AI-created visual concepts. They share a Japanese ink mural, red sun and warm lighting. They are not actual premises or client results. See image-prompts.md for the saved prompts.

## Checks

Run the saved API checks with `node builder/tests/rylo-booking.test.cjs`. The browser flow was checked at 320, 390, 768 and 1440 pixels, including history, downloads, conflicts, offline retry and blocked browser storage.
