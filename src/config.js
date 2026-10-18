// عدّل بيانات الدعوة من هنا
export const invitation = {
  groom: 'محمد',
  bride: 'ريم',
  groomEn: 'Mohamed',
  brideEn: 'Reem',
  // ISO date/time of the ceremony (local time)
  date: '2026-11-12T19:00:00',
  dateText: 'الخميس ١٢ نوفمبر ٢٠٢٦',
  dateShort: '12 . 11 . 2026',
  // English date block (classic invitation layout)
  dateEn: { weekday: 'Thursday', day: '12', month: 'November', year: '2026', time: '7 PM' },
  hijriText: '٢ جمادى الآخرة ١٤٤٨ هـ',
  timeText: 'الساعة السابعة مساءً',
  venue: 'قاعة مسجد نوال الدجوي',
  address: '', // optional extra line under the venue name
  mapUrl: 'https://maps.app.goo.gl/NgqoNV2cquz59UqX8',
  // Google Calendar event window (local Cairo time)
  calendar: { start: '20261112T190000', end: '20261112T230000', timeZone: 'Africa/Cairo' },
  // برنامج الحفل — عدّل الأوقات والفقرات كما تريد
  program: [
    { time: '٧:٠٠ م', title: 'استقبال الضيوف', note: 'أهلاً وسهلاً بكم' },
    { time: '٧:٣٠ م', title: 'عقد القران', note: 'على سنة الله ورسوله' },
    { time: '٨:٣٠ م', title: 'العشاء', note: 'مائدة الفرح' },
    { time: '٩:٣٠ م', title: 'الدعاء والختام', note: 'بارك الله لهما' },
  ],
  // WhatsApp number for RSVP (international format, digits only)
  rsvpPhone: '201000000000',
}
