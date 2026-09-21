# Rylo barber website

Public page: /rylo-barber/
Private booking inbox: /rylo-barber/inbox.html

The layout adapts the library's Noir template to the supplied Japanese ink artwork. It is built for phones first. The three Pexels photos are labelled as style references, not Rylo client work. Photo credits appear in the footer.

Bookings are appointment requests. The shop must contact the customer to agree the time and price. No availability, prices, hours or address have been invented. There are no automatic email or WhatsApp alerts. Open the inbox and use Refresh to see new requests.

The inbox uses the existing website builder passcode. It allows staff to read requests, call customers, update their status and delete them. The password is kept in memory only and is removed on sign-out or reload.

The API at /api/rylo-booking uses the existing BLOB_READ_WRITE_TOKEN, BUILDER_API_KEY and BUILDER_AI_PASSCODE server settings. Customer details are encrypted before saving to Blob. Keep BUILDER_API_KEY unchanged while records exist, or migrate their encryption before rotating that key. No customer details are put in public site records. The public form never receives storage credentials.

Booking dates and times are customer preferences, stored with the customer's time-zone offset. Requests are not confirmed slots. The server checks dates, allowed services, input sizes, and phone format. It rejects repeated bursts on each running server. A request ID prevents a lost-connection retry from saving the same booking twice.

Checked: encrypted storage, input rejection, retry safety, inbox access, status changes, deletion, 320/390/768/1440px layouts, image loading, gallery controls, booking-form submission, repeat requests and reduced motion.
