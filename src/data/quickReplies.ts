import type { QuickReply } from '@/types';

export const quickReplies: QuickReply[] = [
  { id: 'q001', category: '开场', tag: '问候', content: '您好呀~我是咨询师{name}，很高兴为您服务😊 请问有什么可以帮您的吗？' },
  { id: 'q002', category: '开场', tag: '主动询问', content: '请问您是想了解哪个项目呢？我可以为您详细介绍一下~' },
  { id: 'q003', category: '开场', tag: '欢迎语', content: '欢迎咨询~我们医院是正规医美机构，有什么想了解的都可以问我哦！' },
  { id: 'q004', category: '隆鼻', tag: '价格介绍', content: '隆鼻的价格从几千到几万不等，主要看您选择的材料和术式。常见的有假体隆鼻、肋软骨隆鼻、玻尿酸隆鼻等，您更倾向于哪种呢？' },
  { id: 'q005', category: '隆鼻', tag: '恢复期', content: '隆鼻的恢复期：术后7天拆线，基本消肿需要2-3周，完全恢复自然需要1-3个月哦。' },
  { id: 'q006', category: '隆鼻', tag: '疼痛感', content: '手术是全麻的，术中不会疼。术后前2-3天会有些胀痛，都是可以忍受的，我们也会有止疼药~' },
  { id: 'q007', category: '皮肤', tag: '光子嫩肤', content: '光子嫩肤是入门级的皮肤项目，主要改善肤色暗沉、毛孔粗大、红血丝等问题。一个疗程一般3-5次，每次间隔1个月左右。' },
  { id: 'q008', category: '皮肤', tag: '超皮秒', content: '超皮秒主要用于祛斑、洗纹身、改善痘印等。祛斑的话一般需要3-5次，每次间隔2-3个月。' },
  { id: 'q009', category: '皮肤', tag: '水光针', content: '水光针主要是补水保湿，改善皮肤干燥缺水的状态。基础水光大概1-2千一次，建议按疗程做效果更好。' },
  { id: 'q010', category: '抗衰', tag: '热玛吉', content: '热玛吉是射频抗衰项目，可以紧致提升、改善皱纹。全脸五代热玛吉大概在2-3万左右，效果可以维持1-2年。' },
  { id: 'q011', category: '抗衰', tag: '线雕', content: '线雕提升是用可吸收的蛋白线来提拉松弛的皮肤，全脸大概2-5万不等，维持时间1-2年。' },
  { id: 'q012', category: '抗衰', tag: '玻尿酸', content: '玻尿酸填充可以改善凹陷、塑形，比如太阳穴、苹果肌、鼻子、下巴等。价格从几千到一万多一支，看选择的品牌。' },
  { id: 'q013', category: '邀约', tag: '约面诊', content: '建议您可以来院让医生面诊一下，帮您设计适合的方案。我们医院地址在{address}，您什么时候方便呢？' },
  { id: 'q014', category: '邀约', tag: '优惠活动', content: '我们现在有活动哦，到院可以免费设计方案，还有新人优惠。您什么时候方便来院了解一下？' },
  { id: 'q015', category: '常见问题', tag: '医院资质', content: '我们是正规的医疗美容机构，有卫生局颁发的医疗机构执业许可证，医生都是有执业资格的，可以放心~' },
  { id: 'q016', category: '常见问题', tag: '预约方式', content: '您可以告诉我您的姓名和联系方式，我帮您预约面诊时间。到院前会有客服跟您确认的~' },
  { id: 'q017', category: '结束', tag: '结束语', content: '好的，有任何问题随时联系我哦~期待您的光临！😊' },
  { id: 'q018', category: '结束', tag: '未回复跟进', content: '请问您还在吗？还有什么想了解的可以随时问我~' },
];

export const getQuickRepliesByCategory = (category: string): QuickReply[] => {
  if (!category || category === '全部') return quickReplies;
  return quickReplies.filter(q => q.category === category);
};

export const quickReplyCategories = ['全部', '开场', '隆鼻', '皮肤', '抗衰', '邀约', '常见问题', '结束'];
