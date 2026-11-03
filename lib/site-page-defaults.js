// Public editorial and legal content. These are starter drafts, not a substitute for company/legal approval.
// All live changes are published through Admin > Pages, FAQs & SEO.
export const PAGE_DEFINITIONS = {
  home: { path: '/', name: 'Homepage', title: 'B2B Destination Management Company', description: 'Explore destination expertise, curated land programmes and tailored B2B travel solutions for travel agencies.' },
  destinations: { path: '/destinations', name: 'Destinations', title: 'Destinations for Travel Agents', description: 'Explore Dubai, Singapore, Thailand, Malaysia, Bali, Vietnam and Maldives with practical DMC planning guidance.' },
  packages: { path: '/packages', name: 'Packages', title: 'B2B Travel Packages & Itineraries', description: 'Compare customisable international land packages for FIT, families, groups and MICE travel.' },
  programmes: { path: '/programmes', name: 'Trade programmes', title: 'Trade Programmes & Itinerary Ideas', description: 'Browse sample destination programmes with day-wise itineraries and ground-operation planning notes.' },
  services: { path: '/services', name: 'DMC services', title: 'Destination Management Services', description: 'Ground handling, tours, hotel coordination, transfers, custom itineraries and B2B destination support.' },
  partners: { path: '/partners', name: 'For travel agents', title: 'For Travel Agents & Partners', description: 'How DreamTrawell collaborates with travel agencies on destination planning, quotations and ground support.' },
  about: { path: '/about', name: 'About us', title: 'About DreamTrawell Destination', description: 'Meet our destination-first DMC approach: local knowledge, travel-agent collaboration and clear ground planning.' },
  contact: { path: '/contact', name: 'Contact', title: 'Contact Our DMC Trade Desk', description: 'Submit a trade enquiry, request an itinerary or contact DreamTrawell Destination for B2B travel support.' },
  offers: { path: '/offers', name: 'Trade promotions', title: 'Travel Trade Promotions', description: 'Explore currently published trade promotion concepts and request a customised quotation.' },
  testimonials: { path: '/testimonials', name: 'Testimonials', title: 'Travel Partner Testimonials', description: 'Explore permission-verified feedback from travel-agency partners.' },
  faqs: { path: '/faqs', name: 'Frequently asked questions', title: 'Travel Agent FAQs', description: 'Answers about B2B DMC quotations, customisation, transfers, availability and travel-agent enquiries.' },
  'privacy-policy': { path: '/privacy-policy', name: 'Privacy policy', title: 'Privacy Policy', description: 'How DreamTrawell Destination handles personal information submitted through its B2B website.' },
  'terms-of-use': { path: '/terms-of-use', name: 'Terms of use', title: 'Website Terms of Use', description: 'Terms for using the DreamTrawell Destination B2B information and quotation website.' },
  cookies: { path: '/cookies', name: 'Cookies & tracking', title: 'Cookies & Tracking Notice', description: 'Information about essential browser storage, optional analytics and cookie choices.' },
  disclaimer: { path: '/disclaimer', name: 'Travel information disclaimer', title: 'Travel Information Disclaimer', description: 'Important information about indicative itineraries, travel logistics and quotation confirmations.' },
  accessibility: { path: '/accessibility', name: 'Accessibility', title: 'Website Accessibility', description: 'Accessibility guidance and how to report issues using the DreamTrawell website.' },
};

const text = (heading, body) => ({ type: 'text', heading, body });
export const LEGAL_DEFAULTS = {
  'privacy-policy': [
    text('Overview', 'DreamTrawell Destination operates this business-to-business destination management website for travel professionals. This notice explains information we request through website forms and the reasons for using it. Before publication, the company should confirm its registered legal entity name, official privacy contact and actual retention practices.'),
    text('Information we collect', 'When you request a quotation or contact us, we may collect your travel agency name, contact person, business email, telephone number, traveller counts, proposed travel dates, destinations, accommodation and activity preferences, and the notes you provide. Please avoid including passport numbers, payment information, health information or other sensitive traveller details in website enquiry notes.'),
    text('Purposes of use', 'We use enquiry information to respond to travel trade requests, prepare or refine indicative itineraries, coordinate requested services, manage follow-ups and maintain appropriate business records. We do not provide an online checkout or collect payment-card details through this website.'),
    text('Service providers and access', 'Website data may be processed through Firebase and related hosting services used to operate the site. Authorised staff may access enquiries to provide quotations and follow-up. The business should confirm the final list of connected communication and analytics services, applicable transfer arrangements and access controls before launching.'),
    text('Retention and security', 'We use technical and organisational safeguards to limit access to enquiry information. No online transmission or storage is guaranteed to be completely secure. The company must establish and publish a verified retention period, deletion schedule and incident-response contact before final approval of this notice.'),
    text('Your requests and contact', 'To request access, correction, deletion or clarification about your enquiry information, contact our team through the Contact page and mark the request “Privacy”. We may need reasonable verification before acting on a request. The company must replace this contact method with a verified privacy contact before production approval.'),
    text('Updates', 'We may update this notice when website systems or operational practices change. The currently published version on this page applies from its stated publication date, subject to applicable law.'),
  ],
  'terms-of-use': [
    text('Business-to-business use', 'This website is provided for travel agents and travel trade partners seeking destination information, itinerary ideas and quotation assistance. It is not a consumer booking or online payment platform.'),
    text('Indicative information only', 'Descriptions, routes, sightseeing examples, hotels, inclusions, travel times and programme durations are planning references. They may change without notice and do not constitute confirmed availability, a binding quotation, or a travel contract.'),
    text('Quotation and confirmations', 'Submitting an enquiry does not create a booking. Rates, availability, taxes, service scope, cancellation arrangements and supplier conditions must be separately communicated and accepted in the final written quotation or booking confirmation.'),
    text('Accuracy and travel responsibilities', 'Travel agents and travellers are responsible for checking their own travel documents, passport and visa requirements, insurance needs, personal suitability and current entry requirements. Our team can assist with destination planning, but information should be verified with competent authorities and confirmed service providers.'),
    text('Intellectual property', 'The DreamTrawell name, logo and original website materials may not be reproduced for commercial use without permission. Third-party imagery, marks and destination information remain subject to their respective owners and licence terms.'),
    text('Acceptable use', 'Do not submit false enquiries, attempt unauthorised access, interfere with website security, scrape protected systems, or use the website in violation of applicable law.'),
    text('Limitations and governing terms', 'These general website terms do not replace separately agreed trade booking contracts. Any final limitation of liability, dispute resolution, governing law and company identification must be reviewed and confirmed by legal counsel before production publication.'),
  ],
  cookies: [
    text('Browser storage and cookies', 'Our website may use necessary browser storage for security, session continuity and sign-in functions. The admin console uses Microsoft/Firebase authentication, which can require authentication-related cookies or local browser storage.'),
    text('Analytics and optional services', 'The source code can initialise Firebase Analytics where configured. Before launch, confirm which analytics services are enabled, which data they collect, and whether a consent banner or other controls are needed for your visitors and applicable markets.'),
    text('Your choices', 'You can use your browser settings to manage cookies and site storage. Disabling necessary storage may affect sign-in or site functions. If optional non-essential tracking is introduced, publish an appropriate choice mechanism before enabling it.'),
    text('Contact', 'For questions about browser storage or tracking, use the website Contact page and mark the enquiry “Privacy”.'),
  ],
  disclaimer: [
    text('Travel programmes are examples', 'All published packages and trade programmes are intended as customisable starting points for travel professionals, not guaranteed fixed-price departures.'),
    text('Independent verification required', 'Attraction availability, supplier operating hours, transfers, hotel conditions, entry permits, weather-related access and on-ground logistics can change. Verify current arrangements and applicable requirements before confirming travel.'),
    text('No displayed supplier net rates', 'The website does not publish confidential supplier net prices, internal gross profit, supplier contracts or customer checkout prices. Final commercial terms are issued separately in a confirmed trade quotation.'),
    text('Images and descriptions', 'Photographs may be representative. An image does not guarantee a particular hotel, room, attraction view or service unless expressly confirmed as part of the final arrangement.'),
  ],
  accessibility: [
    text('Our approach', 'We aim to make this website accessible to travel professionals using different devices, browsers, keyboards and assistive technologies. We continue to review readability, colour contrast, keyboard navigation and form feedback.'),
    text('Known limitations', 'Some third-party images, embedded content, maps or historical material may not offer equivalent accessibility features. We welcome reports that help us prioritise improvements.'),
    text('Report an issue', 'If you experience a barrier, contact the DMC trade desk through our Contact page. Include the page URL, device or browser, and a short description of the issue so the team can investigate.'),
  ],
};
export const FAQ_DEFAULTS = [
  { question: 'Does DreamTrawell work directly with travellers?', answer: 'This website is designed for travel agents and travel trade partners. Submit requirements through your agency for a B2B quotation.' },
  { question: 'Are the package prices final?', answer: 'No public net rates are shown. Package pages are indicative and are customised and costed after the team reviews actual dates, travellers and inclusions.' },
  { question: 'Can I change hotels, activities or itinerary days?', answer: 'Yes. Open a package and choose Customise. Share your preferred hotel category, changes to individual days and additional experiences.' },
  { question: 'Do you arrange FIT, groups and MICE?', answer: 'The website includes FIT, family, group and MICE-oriented programme concepts. Availability and operational scope depend on the destination and enquiry details.' },
  { question: 'Are transfers SIC or private?', answer: 'Transfer options vary by programme. Specify SIC, private or your preferred arrangement in the quotation brief. The confirmed proposal will clarify the actual service type.' },
  { question: 'How do I request a destination not shown?', answer: 'Use the Contact page to ask the destination desk about your requirement. A response does not imply that new destinations are available until confirmed.' },
  { question: 'Is submitting an enquiry a booking?', answer: 'No. The website does not accept checkout payments or issue automatic booking confirmations. Bookings require separately confirmed commercial and service arrangements.' },
  { question: 'What information helps you quote accurately?', answer: 'Destination, travel dates, number of adults and children, hotel category, room needs, preferred activities, transfer type and any practical restrictions are especially helpful.' },
];
export function initialPage(key) {
  const def = PAGE_DEFINITIONS[key];
  if (!def) return null;
  return { slug: key, status:'published', heroTitle:'', heroDescription:'', sections: LEGAL_DEFAULTS[key] || [], faqs: key === 'faqs' ? FAQ_DEFAULTS : [], textOverrides:{}, contactDetails:{location:'Mumbai, India',email:'',phone:'',privacyEmail:'',legalName:''}, seoTitle: def.title, seoDescription: def.description, socialImage:'', updatedLabel:'' };
}
