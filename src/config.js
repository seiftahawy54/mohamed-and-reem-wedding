// عدّل بيانات الدعوة من هنا
export const invitation = {
  groom: 'محمد',
  bride: 'ريم',
  groomEn: 'Mohamed',
  brideEn: 'Reem',
  // Ceremony start in Cairo time (EET, UTC+2 in November) so the countdown is right in any timezone
  date: '2026-11-12T18:00:00+02:00',
  dateText: 'الخميس ١٢ نوفمبر ٢٠٢٦',
  dateShort: '12 . 11 . 2026',
  // English date block (classic invitation layout)
  dateEn: { weekday: 'Thursday', day: '12', month: 'November', year: '2026', time: '6 PM' },
  hijriText: '٢ جمادى الآخرة ١٤٤٨ هـ',
  timeText: 'الساعة السادسة مساءً',
  venue: 'قاعة مسجد نوال الدجوي',
  address: '', // optional extra line under the venue name
  mapUrl: 'https://maps.app.goo.gl/NgqoNV2cquz59UqX8',
  // Google Calendar event window (local Cairo time)
  calendar: { start: '20261112T180000', end: '20261112T220000', timeZone: 'Africa/Cairo' },
  // برنامج الحفل — عدّل الأوقات والفقرات كما تريد
  program: [
    // icon: 'arch' | 'rings' | 'moon'
    { time: '٦:٠٠ م', title: 'استقبال الضيوف', note: 'أهلاً وسهلاً بكم', icon: 'arch' },
    { time: '٦:٠٠ م', title: 'عقد القران', note: 'على سنة الله ورسوله', icon: 'rings' },
    { time: '٨:٠٠ م', title: 'الدعاء والختام', note: 'بارك الله لهما', icon: 'moon' },
  ],
}
