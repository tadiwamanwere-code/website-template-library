# Long Range Pharmacy

This template is the client's own live storefront, kept as it stands.

**Where it came from:** `long-range-pharmacies.vercel.app`, a React app. The
page was taken as it renders, its stylesheet was inlined, and every brand
colour in that stylesheet was swapped for a CSS variable — which is the only
change of substance. A compiled stylesheet writes the hex code into every
rule, and a hex code cannot be themed.

`builder/passes/build-pharmacy.js` does that, and can be run again if the
client's site changes. `builder/passes/pass19-pharmacy.js` then takes out
everything that would be a lie for the next pharmacy and writes the swap
card.

**What came out:** the parent company, three named branches with their
streets and phone numbers, the city, the year they were licensed, the
Instagram handle, and a 24/7 support promise nobody else has made.

**What stayed:** the design, exactly. The hero carousel, the reveals and the
menus are now about sixty lines of plain JavaScript at the foot of the file
instead of a framework.

**It breaks one house rule on purpose.** A shop needs a commerce palette:
green for the buttons, coral for urgency, yellow for a highlight. That is
the brief, not an oversight.

**Payment marks.** The footer lists EcoCash, InnBucks and ZimSwitch. Those
are Zimbabwean. Hide that row, or change the marks, before sending this to a
client anywhere else.
