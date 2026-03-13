import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertTriangle,
  ArrowRight,
  BadgeCheck,
  Bell,
  Bot,
  Building2,
  CheckCircle2,
  ChevronRight,
  ClipboardCheck,
  Crown,
  Download,
  Eye,
  FileText,
  Gift,
  Info,
  LineChart,
  Lock,
  LogIn,
  MapPin,
  Menu,
  PenSquare,
  Phone,
  Save,
  Search,
  Send,
  Settings2,
  ShieldCheck,
  Sparkles,
  Star,
  UserCheck,
  Users,
  Wand2,
  X,
  Zap,
} from "lucide-react";

const BRAND = {
  primary: "#0E2A47",
  primarySoft: "#EAF1F8",
  primaryLight: "#1A3A5F",
  primaryDark: "#0A1E35",
  gold: "#C9A45C",
  goldSoft: "#FBF4E8",
  goldLight: "#D6B57A",
  success: "#10B981",
  successSoft: "#ECFDF3",
  danger: "#EF4444",
  dangerSoft: "#FEF2F2",
  info: "#3B82F6",
  infoSoft: "#EEF6FF",
  warning: "#F59E0B",
  warningSoft: "#FFFBEB",
  slate: {
    50: "#F8FAFC",
    100: "#F1F5F9",
    200: "#E2E8F0",
    300: "#CBD5E1",
    400: "#94A3B8",
    500: "#64748B",
    600: "#475569",
    700: "#334155",
    800: "#1E293B",
    900: "#0F172A",
  },
};

const roleOptions = ["总部运营经理", "城市运营", "门店顾问"];
const cityOptions = ["全部城市", "上海", "杭州"];
const storeOptions = ["全部门店", "浦东店", "虹桥店", "滨江店", "西湖店"];

const steps = [
  {
    id: 1,
    key: "identify",
    title: "Step 1 · 风险识别",
    short: "识别风险会员",
    owner: "AI",
    agents: ["统一洞察 Agent", "积分运营 Agent"],
    intervention: "否",
    icon: Users,
    color: "from-sky-600 to-cyan-500",
    summary: "自动识别“即将降级 + 高积分余额 + 近90天低活跃”的高价值会员，并输出原因诊断。",
    outputs: ["风险会员名单", "问题诊断结果", "人群分层标签"],
    detail: {
      insight: [
        "612 位高价值会员在 30 天内面临降级",
        "平均积分余额 8,420 分",
        "近 90 天未回厂占比 73%",
        "近 90 天未权益核销占比 81%",
      ],
      diagnosis: ["权益感知弱", "积分使用门槛高", "缺少触发场景", "高等级专属感不足"],
    },
  },
  {
    id: 2,
    key: "strategy",
    title: "Step 2 · 策略生成",
    short: "生成多套方案",
    owner: "AI",
    agents: ["统一策略 Agent", "权益策略 Agent"],
    intervention: "否",
    icon: Sparkles,
    color: "from-violet-600 to-fuchsia-500",
    summary: "自动生成多套联动经营方案，并预估核销率、回厂率和会员感知。",
    outputs: ["多套策略建议", "效果预估", "推荐方案排序"],
    plans: [
      { name: "方案 A｜通用保级提醒", desc: "发送降级提醒 + 权益到期提醒，适合轻度沉默用户。", metrics: { 打开率: "32%", 核销率: "8%", 回厂率: "5%" } },
      { name: "方案 B｜积分兑换保养券", desc: "用积分兑换基础保养券/洗车券，降低兑换门槛。", metrics: { 打开率: "38%", 核销率: "15%", 回厂率: "11%" } },
      { name: "方案 C｜保级任务包 + 露营礼包", desc: "以身份感 + 任务感 + 场景权益激活高价值会员。", metrics: { 打开率: "45%", 核销率: "22%", 回厂率: "18%" }, recommended: true },
    ],
  },
  {
    id: 3,
    key: "approval",
    title: "Step 3 · 经营审批",
    short: "运营经理审批",
    owner: "人工",
    agents: ["运营经理"],
    intervention: "是（关键审批节点）",
    icon: ShieldCheck,
    color: "from-amber-500 to-orange-500",
    summary: "运营经理审核权益成本、会员体验与门店承接能力，最终确认执行方案。",
    outputs: ["确认后的执行方案", "积分门槛调整", "门店资源建议"],
    review: ["选择方案 C 作为主方案", "露营礼包兑换门槛由 8,000 分下调至 6,000 分", "重点城市门店增加顾问承接资源"],
  },
  {
    id: 4,
    key: "execute",
    title: "Step 4 · 首轮执行",
    short: "自动触达与权益发放",
    owner: "AI",
    agents: ["统一创作 Agent", "统一执行与优化 Agent"],
    intervention: "否（标准化执行）",
    icon: Bell,
    color: "from-emerald-600 to-teal-500",
    summary: "自动完成客群圈选、文案生成、权益发放、兑换入口配置，并发起首轮触达。",
    outputs: ["活动上线", "多渠道触达已发送", "权益与任务包已配置"],
    messages: [
      { channel: "短信", text: "【永达会员】尊贵会员您好，您的当前等级即将到期。现可参与专属保级任务，并使用积分兑换露营出行礼包，限时开放 48 小时。" },
      { channel: "App Push", text: "您的尊享会员权益即将降级，专属保级任务已开启，积分还能兑换露营礼包，立即解锁。" },
      { channel: "企微私信", text: "张先生您好，您当前会员等级可参与本次专属保级任务，完成后可继续保留当前等级，同时您账户内积分可兑换出行礼包。" },
    ],
  },
  {
    id: 5,
    key: "engage",
    title: "Step 5 · 响应分析",
    short: "打开 / 点击 / 兑换分层",
    owner: "AI",
    agents: ["统一执行与优化 Agent", "行为分析 Agent"],
    intervention: "否",
    icon: Zap,
    color: "from-sky-600 to-indigo-500",
    summary: "自动追踪会员打开、点击、兑换、预约等行为，并对不同状态人群做分层。",
    outputs: ["行为分层结果", "二次触发建议", "重点观察人群"],
    segment: [
      "已打开未兑换：触发解释型补文案",
      "已兑换未核销：触发到店预约提醒",
      "已预约未到店：门店顾问电话确认",
      "完全未响应：48 小时自动补触达",
    ],
  },
  {
    id: 6,
    key: "intervene",
    title: "Step 6 · 异常干预",
    short: "异常预警与人工判断",
    owner: "AI + 人工",
    agents: ["AI 监控", "运营经理", "门店顾问"],
    intervention: "是（异常升级节点）",
    icon: AlertTriangle,
    color: "from-rose-500 to-red-500",
    summary: "若“已打开未兑换”比例异常偏高，系统自动预警，由运营经理判断是否追加门店顾问一对一提醒。",
    outputs: ["重点客户跟进名单", "补充触达方案", "门店协同动作"],
    anomaly: {
      openRate: "46%",
      redeemRate: "9%",
      abnormalRatio: "61%",
      reasons: ["兑换门槛感知仍偏高", "权益说明不够直观", "缺少临门一脚的人为承接"],
      decision: "追加重点客户门店顾问一对一提醒",
    },
  },
  {
    id: 7,
    key: "reengage",
    title: "Step 7 · 补触达与门店承接",
    short: "二次触达闭环",
    owner: "AI + 人工",
    agents: ["统一执行与优化 Agent", "门店顾问"],
    intervention: "是（门店承接）",
    icon: UserCheck,
    color: "from-cyan-500 to-emerald-500",
    summary: "自动补触达未转化客群，并把高价值重点客户同步到门店顾问进行一对一承接。",
    outputs: ["补触达完成", "门店跟进状态", "预约与到店结果"],
    loop: ["补发解释型短信，强化限时和专属感", "App Push 增加一键预约入口", "企微提醒同步顾问名片", "门店顾问电话确认到店时间"],
  },
  {
    id: 8,
    key: "review",
    title: "Step 8 · 复盘沉淀",
    short: "沉淀经营模板",
    owner: "AI + 人工",
    agents: ["统一执行与优化 Agent", "积分运营 Agent", "运营经理"],
    intervention: "人工决定是否纳入长期 SOP",
    icon: LineChart,
    color: "from-slate-600 to-slate-900",
    summary: "自动输出保级率、积分消耗率、回厂率与核销率，并沉淀为高价值会员保级模板。",
    outputs: ["复盘报告", "可复用模板", "长期 SOP 建议"],
    result: [
      { label: "保级率", value: "+12.6%" },
      { label: "积分消耗率", value: "+18.3%" },
      { label: "权益核销率", value: "+9.4%" },
      { label: "回厂率", value: "+7.8%" },
      { label: "高价值会员活跃率", value: "+15.1%" },
    ],
  },
];

const channelStatsByStep = {
  4: [
    { channel: "短信", sent: 612, rate: "送达率 98.4%", action: "点击率 18.2%" },
    { channel: "App Push", sent: 586, rate: "到达率 94.1%", action: "打开率 27.3%" },
    { channel: "企微私信", sent: 255, rate: "送达率 91.8%", action: "回复率 13.4%" },
  ],
  5: [
    { channel: "短信", sent: 612, rate: "点击率 18.2%", action: "兑换率 8.7%" },
    { channel: "App Push", sent: 586, rate: "打开率 27.3%", action: "预约率 6.5%" },
    { channel: "企微私信", sent: 255, rate: "回复率 13.4%", action: "预约率 9.1%" },
  ],
  7: [
    { channel: "补发短信", sent: 188, rate: "送达率 97.9%", action: "转化率 12.6%" },
    { channel: "补发 App Push", sent: 163, rate: "到达率 93.6%", action: "预约率 10.3%" },
    { channel: "顾问私信", sent: 85, rate: "已读率 79.2%", action: "到店率 24.7%" },
  ],
};

const systemNotices = [
  { level: "high", text: "高价值会员保级活动存在异常升级待处理，建议优先查看。" },
  { level: "info", text: "上海城市经营团队已完成重点客群首轮触达校验。" },
  { level: "normal", text: "上周期“售后回厂激活”活动已完成 SOP 归档。" },
];

const dashboardCards = [
  { title: "经营活动中心", desc: "会员保级、积分唤醒、权益激活联动编排", status: "进行中" },
  { title: "高价值会员池", desc: "即将降级高净值车主自动识别与分层", status: "已更新" },
  { title: "门店承接协同", desc: "异常升级后同步顾问一对一跟进", status: "待确认" },
];

const members = [
  { 
    id: 1, 
    name: "张先生", 
    level: "钻石会员", 
    score: 12400, 
    status: "30天内降级", 
    lastAction: "93天未回厂", 
    tag: "高风险", 
    city: "上海", 
    store: "浦东店", 
    advisor: "顾问 张琳", 
    engagement: "待触达",
    journey: [
      { date: "2026-01-15", action: "会员等级升级为钻石", status: "完成" },
      { date: "2026-02-10", action: "最后一次回厂保养", status: "完成" },
      { date: "2026-03-01", action: "积分达到12400分", status: "完成" },
      { date: "2026-03-10", action: "系统识别为高风险", status: "进行中" },
      { date: "2026-03-12", action: "发送保级提醒", status: "待执行" },
      { date: "2026-03-20", action: "预计等级到期", status: "待执行" },
    ],
    preferences: ["喜欢露营活动", "关注保养优惠", "对积分兑换感兴趣"],
    vehicles: ["宝马 5系", "奔驰 E级"]
  },
  { 
    id: 2, 
    name: "李女士", 
    level: "黑金会员", 
    score: 9800, 
    status: "22天内降级", 
    lastAction: "95天未核销", 
    tag: "待唤醒", 
    city: "上海", 
    store: "虹桥店", 
    advisor: "顾问 刘洋", 
    engagement: "待触达",
    journey: [
      { date: "2025-12-20", action: "会员等级升级为黑金", status: "完成" },
      { date: "2026-01-15", action: "最后一次回厂", status: "完成" },
      { date: "2026-02-05", action: "积分达到9800分", status: "完成" },
      { date: "2026-03-08", action: "系统识别为待唤醒", status: "进行中" },
      { date: "2026-03-12", action: "发送权益提醒", status: "待执行" },
      { date: "2026-03-25", action: "预计等级到期", status: "待执行" },
    ],
    preferences: ["喜欢高端服务", "关注豪华品牌活动", "对会员专属权益感兴趣"],
    vehicles: ["保时捷 Cayenne", "奥迪 A8"]
  },
  { 
    id: 3, 
    name: "王先生", 
    level: "白金会员", 
    score: 7600, 
    status: "18天内降级", 
    lastAction: "102天未兑换", 
    tag: "可转化", 
    city: "杭州", 
    store: "滨江店", 
    advisor: "顾问 王岚", 
    engagement: "待触达",
    journey: [
      { date: "2026-01-05", action: "会员等级升级为白金", status: "完成" },
      { date: "2026-01-20", action: "最后一次回厂", status: "完成" },
      { date: "2026-02-10", action: "积分达到7600分", status: "完成" },
      { date: "2026-03-05", action: "系统识别为可转化", status: "进行中" },
      { date: "2026-03-12", action: "发送积分兑换提醒", status: "待执行" },
      { date: "2026-03-20", action: "预计等级到期", status: "待执行" },
    ],
    preferences: ["喜欢性价比高的服务", "关注日常保养", "对积分兑换优惠券感兴趣"],
    vehicles: ["丰田 凯美瑞", "大众 途观"]
  },
  { 
    id: 4, 
    name: "陈女士", 
    level: "钻石会员", 
    score: 14200, 
    status: "26天内降级", 
    lastAction: "89天低活跃", 
    tag: "重点跟进", 
    city: "杭州", 
    store: "西湖店", 
    advisor: "顾问 陈楠", 
    engagement: "待触达",
    journey: [
      { date: "2025-11-30", action: "会员等级升级为钻石", status: "完成" },
      { date: "2026-01-30", action: "最后一次回厂", status: "完成" },
      { date: "2026-02-20", action: "积分达到14200分", status: "完成" },
      { date: "2026-03-08", action: "系统识别为重点跟进", status: "进行中" },
      { date: "2026-03-12", action: "发送专属保级方案", status: "待执行" },
      { date: "2026-03-28", action: "预计等级到期", status: "待执行" },
    ],
    preferences: ["喜欢个性化服务", "关注高端体验", "对会员专属活动感兴趣"],
    vehicles: ["路虎揽胜", "捷豹 F-PACE"]
  },
];

const exportedFiles = [
  { name: "高价值会员保级活动复盘报告.pdf", tag: "PDF 报告", desc: "含核心指标、行为分层、门店承接结果、ROI 与优化建议。" },
  { name: "高价值会员保级 SOP 模板.docx", tag: "SOP 模板", desc: "含圈选规则、策略组合、触达节奏、异常处理与门店协同。" },
  { name: "门店重点客户跟进清单.xlsx", tag: "门店清单", desc: "按城市 / 门店 / 顾问拆分的重点客户承接任务表。" },
];

function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

function toneStyles(tone) {
  const styles = {
    slate: "bg-slate-100 text-slate-700 border-slate-200",
    blue: "bg-blue-50 text-blue-700 border-blue-200",
    purple: "bg-violet-50 text-violet-700 border-violet-200",
    green: "bg-emerald-50 text-emerald-700 border-emerald-200",
    amber: "bg-[#FFF7E8] text-[#9A6B16] border-[#E8D19B]",
    rose: "bg-rose-50 text-rose-700 border-rose-200",
    brand: "bg-[#EAF1F8] text-[#0E2A47] border-[#C9D8E7]",
    gold: "bg-[#FBF4E8] text-[#8A6320] border-[#E8D19B]",
  };
  return styles[tone] || styles.slate;
}

function Pill({ children, tone = "slate" }) {
  return <span className={cn("inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium", toneStyles(tone))}>{children}</span>;
}

function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-3">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className="h-12 w-12 border-4 border-primary border-t-transparent rounded-full"
          style={{ borderColor: BRAND.primary, borderTopColor: 'transparent' }}
        />
        <p className="text-sm font-semibold text-slate-700">加载中...</p>
      </div>
    </div>
  );
}

function Shell({ children }) {
  return (
    <div className="min-h-screen text-slate-900" style={{ 
      background: `
        radial-gradient(circle at top left, rgba(14,42,71,0.15), transparent 30%), 
        radial-gradient(circle at top right, rgba(201,164,92,0.12), transparent 25%), 
        radial-gradient(circle at bottom left, rgba(16,185,129,0.10), transparent 20%),
        linear-gradient(to bottom, #f8fafc, #eef4fb 40%, #f8fafc 80%)
      `,
      backgroundAttachment: 'fixed',
      backgroundSize: '100% 100%'
    }}>
      {children}
    </div>
  );
}

function BrandBadge() {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-600 shadow-sm">
      <Crown className="h-4 w-4" style={{ color: BRAND.gold }} />
      永达汽车用户经营中台
    </div>
  );
}

function SectionTitle({ icon: Icon, title, desc, action }) {
  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
      <div>
        <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-white/80 px-3 py-1 text-xs font-semibold text-slate-600 ring-1 ring-slate-200 backdrop-blur">
          <Icon className="h-4 w-4" style={{ color: BRAND.primary }} />
          {title}
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">{title}</h2>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">{desc}</p>
      </div>
      {action}
    </div>
  );
}

function ProgressBar({ value, tone = "brand" }) {
  const barColor = tone === "gold" ? BRAND.gold : BRAND.primary;
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100 shadow-inner">
      <motion.div 
        initial={false} 
        animate={{ width: `${Math.max(0, Math.min(100, value))}%` }} 
        transition={{ type: "spring", stiffness: 90, damping: 18 }}
        className="h-full rounded-full relative"
        style={{ 
          backgroundColor: barColor,
          boxShadow: `0 0 8px rgba(${barColor.replace('#', '0x')}, 0.3)`
        }}
      >
        <motion.div 
          animate={{ opacity: [0, 1, 0] }}
          transition={{ 
            duration: 2, 
            repeat: Infinity, 
            repeatType: "loop",
            delay: Math.random() * 2
          }}
          className="absolute inset-0 bg-white/30 blur-sm rounded-full"
          style={{ 
            transform: "translateX(-100%)",
            animation: "shimmer 2s infinite"
          }}
        />
      </motion.div>
    </div>
  );
}

function StatCard({ label, value, suffix, hint, accent = "brand", trend = "up", trendValue = "5.2%" }) {
  const barColor = accent === "gold" ? BRAND.gold : BRAND.primary;
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ 
        y: -4, 
        boxShadow: `0 20px 40px rgba(14,42,71,0.12)`,
        scale: 1.02
      }}
      className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/50 transition-all duration-300 relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-primarySoft/30 to-transparent rounded-full -translate-y-16 translate-x-16" />
      <div className="flex items-center justify-between mb-4">
        <div className="text-sm font-medium text-slate-500">{label}</div>
        <div className="h-10 w-10 rounded-full flex items-center justify-center" style={{ backgroundColor: `${barColor}20` }}>
          <div className="h-5 w-5 rounded-full" style={{ backgroundColor: barColor }} />
        </div>
      </div>
      <div className="mt-2 flex items-end gap-2">
        <span className="text-3xl font-bold tracking-tight text-slate-900">{value}</span>
        {suffix ? <span className="pb-1 text-sm text-slate-500">{suffix}</span> : null}
        <div className={`flex items-center gap-1 text-xs font-semibold ${trend === "up" ? "text-emerald-600" : "text-rose-600"}`}>
          <ArrowRight className={`h-3 w-3 ${trend === "up" ? "rotate-[-45deg]" : "rotate-45deg"}`} />
          {trendValue}
        </div>
      </div>
      <div className="mt-6"><ProgressBar value={typeof value === "number" ? Math.min(100, value) : 72} tone={accent} /></div>
      {hint ? <div className="mt-4 text-xs text-slate-500">{hint}</div> : null}
    </motion.div>
  );
}

function TimelineStep({ step, active, done, onClick }) {
  const Icon = step.icon;
  return (
    <motion.button
      onClick={onClick}
      className={cn(
        "group relative w-full rounded-3xl border p-6 text-left transition-all duration-300 overflow-hidden",
        active ? "text-white shadow-xl" : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-md hover:border-primary/20"
      )}
      style={active ? { 
        backgroundColor: BRAND.primary, 
        borderColor: BRAND.primary, 
        boxShadow: `0 20px 40px rgba(14,42,71,0.2)`,
        transform: "translateX(12px)"
      } : undefined}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
    >
      {active && (
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-white/10 to-transparent rounded-full -translate-y-32 translate-x-32" />
      )}
      <div className="flex items-start gap-4 relative z-10">
        <motion.div 
          className={cn("flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl transition-all duration-300", 
            active ? "bg-white/15 scale-110" : `bg-gradient-to-br ${step.color} text-white`
          )}
          whileHover={{ scale: 1.15 }}
        >
          {done && !active ? (
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            >
              <CheckCircle2 className="h-6 w-6" />
            </motion.div>
          ) : (
            <Icon className="h-6 w-6" />
          )}
        </motion.div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <div className={cn("truncate font-semibold text-base", active ? "text-white" : "text-slate-900")}>{step.short}</div>
            <Pill tone={active ? "slate" : step.owner.includes("人工") ? "amber" : step.owner.includes("AI +") ? "rose" : "blue"}>{step.owner}</Pill>
          </div>
          <div className={cn("mt-3 text-sm leading-5", active ? "text-slate-200" : "text-slate-600")}>{step.summary}</div>
        </div>
        <motion.div 
          animate={{ rotate: active ? 90 : 0, x: active ? 0 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <ChevronRight className={cn("mt-1 h-5 w-5 shrink-0 transition-transform duration-300", 
            active ? "text-slate-300" : "text-slate-400 group-hover:translate-x-1"
          )} />
        </motion.div>
      </div>
      {active && (
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
          className="absolute top-0 right-0 h-8 w-8 bg-white rounded-br-3xl flex items-center justify-center"
        >
          <div className="h-4 w-4 rounded-full" style={{ backgroundColor: BRAND.gold }} />
        </motion.div>
      )}
    </motion.button>
  );
}

function HumanAICard({ title, items, tone }) {
  const map = {
    ai: {
      gradient: "from-blue-500/10 to-cyan-500/10",
      border: "border-blue-200",
      icon: "bg-blue-100 text-blue-600",
      accent: BRAND.info
    },
    human: {
      gradient: "from-amber-500/10 to-orange-500/10",
      border: "border-[#E8D19B]",
      icon: "bg-amber-100 text-amber-600",
      accent: BRAND.gold
    },
  };
  
  const config = map[tone];
  
  return (
    <div className={cn("rounded-3xl border bg-gradient-to-br p-6 transition-all duration-300 hover:shadow-md", config.gradient, config.border)}>
      <div className="flex items-center gap-3 mb-4">
        <div className={cn("h-10 w-10 rounded-xl flex items-center justify-center", config.icon)}>
          {tone === "ai" ? <Bot className="h-5 w-5" /> : <UserCheck className="h-5 w-5" />}
        </div>
        <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
      </div>
      <div className="mt-4 space-y-3">
        {items.map((item, index) => (
          <motion.div 
            key={item} 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex gap-3 rounded-2xl bg-white/90 p-4 text-sm text-slate-700 ring-1 ring-white hover:bg-white transition-all duration-200"
          >
            <div className="h-6 w-6 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: `${config.accent}20` }}>
              <CheckCircle2 className="h-4 w-4" style={{ color: config.accent }} />
            </div>
            <span>{item}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function KpiBoard({ metrics }) {
  const entries = Object.entries(metrics);
  const colors = [BRAND.gold, BRAND.primary, BRAND.success, BRAND.info, BRAND.warning];
  
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5">
      {entries.map(([label, value], idx) => {
        const color = colors[idx % colors.length];
        return (
          <motion.div 
            key={label} 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-0.5"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="text-sm font-medium text-slate-500">{label}</div>
              <div className="h-8 w-8 rounded-full flex items-center justify-center" style={{ backgroundColor: `${color}20` }}>
                <BadgeCheck className="h-4 w-4" style={{ color: color }} />
              </div>
            </div>
            <div className="mt-1 flex items-end gap-1">
              <span className="text-3xl font-bold tracking-tight text-slate-900">{value}</span>
              <span className="pb-1 text-sm text-slate-500">%</span>
            </div>
            <div className="mt-4">
              <ProgressBar value={value} tone={idx === 0 ? "gold" : "brand"} />
            </div>
            <div className="mt-3 flex items-center gap-2">
              <div className="h-2 w-2 rounded-full" style={{ backgroundColor: BRAND.success }} />
              <span className="text-xs text-slate-500">同比提升 {Math.round(value * 0.15)}%</span>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

function RoleSwitcher({ role, setRole }) {
  return (
    <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm hover:shadow-md transition-all duration-300">
      <div className="h-8 w-8 rounded-full flex items-center justify-center bg-primarySoft">
        <Bot className="h-4 w-4" style={{ color: BRAND.primary }} />
      </div>
      <select 
        value={role} 
        onChange={(e) => setRole(e.target.value)} 
        className="bg-transparent text-slate-700 outline-none font-medium"
        style={{
          appearance: 'none',
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke-width='1.5' stroke='%2364748B' class='w-6 h-6'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M19.5 8.25l-7.5 7.5-7.5-7.5' /%3E%3C/svg%3E")`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'right 0.5rem center',
          backgroundSize: '1.5em 1.5em',
          paddingRight: '2.5rem'
        }}
      >
        {roleOptions.map((item) => (
          <option key={item} className="py-2 px-4 bg-white hover:bg-slate-50">{item}</option>
        ))}
      </select>
    </div>
  );
}

function NoticeList() {
  return (
    <div className="space-y-3">
      {systemNotices.map((notice, idx) => {
        const config = {
          high: {
            border: "border-rose-200",
            bg: "bg-rose-50",
            text: "text-rose-800",
            icon: "bg-rose-100 text-rose-600",
            iconComponent: AlertTriangle
          },
          info: {
            border: "border-blue-200",
            bg: "bg-blue-50",
            text: "text-blue-800",
            icon: "bg-blue-100 text-blue-600",
            iconComponent: Bell
          },
          normal: {
            border: "border-slate-200",
            bg: "bg-slate-50",
            text: "text-slate-700",
            icon: "bg-slate-100 text-slate-600",
            iconComponent: Info
          }
        };
        
        const { border, bg, text, icon, iconComponent: Icon } = config[notice.level] || config.normal;
        
        return (
          <motion.div 
            key={idx} 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            className={cn("flex gap-3 rounded-2xl border px-4 py-4 text-sm transition-all duration-300 hover:shadow-sm", border, bg, text)}
          >
            <div className={cn("h-8 w-8 rounded-full flex items-center justify-center shrink-0", icon)}>
              <Icon className="h-4 w-4" />
            </div>
            <div className="flex-1">
              <div className="font-medium">{notice.level === "high" ? "重要提醒" : notice.level === "info" ? "信息通知" : "系统通知"}</div>
              <div className="mt-1 text-sm">{notice.text}</div>
              <div className="mt-2 text-xs text-slate-500">{new Date().toLocaleTimeString()}</div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

function LifecycleBar({ currentStep }) {
  const stages = ["识别", "策略", "审批", "执行", "复盘"];
  const currentStage = currentStep <= 1 ? 0 : currentStep <= 2 ? 1 : currentStep <= 3 ? 2 : currentStep <= 7 ? 3 : 4;
  
  return (
    <div className="flex items-center gap-3">
      {stages.map((stage, idx) => (
        <div key={stage} className="relative flex-1">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className={cn(
              "rounded-2xl border px-4 py-4 text-center text-sm font-semibold transition-all duration-300 relative overflow-hidden",
              idx < currentStage 
                ? "border-emerald-200 bg-emerald-50 text-emerald-700 hover:shadow-sm"
                : idx === currentStage 
                  ? "text-white shadow-md"
                  : "border-slate-200 bg-white text-slate-500 hover:border-slate-300 hover:shadow-sm"
            )}
            style={idx === currentStage ? { backgroundColor: BRAND.primary, borderColor: BRAND.primary } : undefined}
          >
            {stage}
            {idx < currentStage && (
              <div className="absolute top-0 right-0 h-6 w-6 bg-emerald-100 rounded-bl-2xl flex items-center justify-center">
                <CheckCircle2 className="h-3 w-3 text-emerald-600" />
              </div>
            )}
          </motion.div>
          {idx < stages.length - 1 && (
            <div className="hidden md:block absolute top-1/2 left-full transform -translate-y-1/2 -translate-x-1/2 w-8 h-0.5 bg-slate-200">
              {idx < currentStage && (
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="h-full bg-emerald-500"
                />
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function ChannelBoard({ stepId }) {
  const items = channelStatsByStep[stepId] || channelStatsByStep[4];
  const channelColors = {
    "短信": BRAND.info,
    "App Push": BRAND.success,
    "企微私信": BRAND.gold,
    "补发短信": BRAND.warning,
    "补发 App Push": BRAND.info,
    "顾问私信": BRAND.primary
  };
  
  return (
    <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition-all duration-300">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl flex items-center justify-center bg-primarySoft">
            <Send className="h-5 w-5" style={{ color: BRAND.primary }} />
          </div>
          <h3 className="text-lg font-semibold text-slate-900">渠道执行看板</h3>
        </div>
        <Pill tone="brand">实时回传</Pill>
      </div>
      <div className="mt-2 space-y-4">
        {items.map((item, index) => {
          const color = channelColors[item.channel] || BRAND.primary;
          return (
            <motion.div 
              key={item.channel} 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="rounded-2xl border border-slate-200 bg-slate-50 p-5 hover:bg-white transition-all duration-300"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full flex items-center justify-center" style={{ backgroundColor: `${color}20` }}>
                    <Send className="h-4 w-4" style={{ color: color }} />
                  </div>
                  <div className="font-semibold text-slate-900">{item.channel}</div>
                </div>
                <Pill tone="blue">发送 {item.sent}</Pill>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-xl bg-white px-4 py-3 border border-slate-100 shadow-sm">
                  <div className="text-xs text-slate-500 mb-1">送达情况</div>
                  <div className="font-medium text-slate-900">{item.rate}</div>
                </div>
                <div className="rounded-xl bg-white px-4 py-3 border border-slate-100 shadow-sm">
                  <div className="text-xs text-slate-500 mb-1">互动情况</div>
                  <div className="font-medium text-slate-900">{item.action}</div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

function TodoBoard({ role }) {
  const todos = role === "门店顾问"
    ? ["优先联系 8 位高价值会员", "确认 3 位客户到店时间", "回传顾问跟进结果"]
    : role === "城市运营"
      ? ["检查上海城市经营活动送达率", "复核重点门店承接名单", "确认补触达策略执行窗口"]
      : ["审批异常升级活动方案", "复核预算与权益成本", "确认模板沉淀入库"];
  
  const roleConfig = {
    "门店顾问": {
      color: BRAND.success,
      icon: UserCheck
    },
    "城市运营": {
      color: BRAND.info,
      icon: Building2
    },
    "总部运营经理": {
      color: BRAND.primary,
      icon: Crown
    }
  };
  
  const config = roleConfig[role] || roleConfig["总部运营经理"];
  const Icon = config.icon;
  
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition-all duration-300">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${config.color}20` }}>
            <Icon className="h-5 w-5" style={{ color: config.color }} />
          </div>
          <h3 className="text-lg font-semibold text-slate-900">当前待办</h3>
        </div>
        <Pill tone="gold">{role}</Pill>
      </div>
      <div className="space-y-4">
        {todos.map((item, index) => (
          <motion.div 
            key={item} 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex gap-3 rounded-2xl bg-slate-50 p-4 text-sm text-slate-700 hover:bg-white transition-all duration-300 border border-slate-200"
          >
            <div className="h-6 w-6 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: `${config.color}20` }}>
              <CheckCircle2 className="h-4 w-4" style={{ color: config.color }} />
            </div>
            <div className="flex-1">
              <div className="font-medium text-slate-900">{item}</div>
              <div className="mt-1 text-xs text-slate-500">优先级 {3 - index}</div>
            </div>
            <div className="h-2 w-2 rounded-full" style={{ backgroundColor: config.color }} />
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function LoginScreen({ onEnter, role, setRole }) {
  return (
    <Shell>
      <div className="mx-auto flex min-h-screen max-w-7xl items-center px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid w-full grid-cols-1 gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="rounded-3xl border border-white/60 bg-white p-8 shadow-xl shadow-slate-200/40 lg:p-12 relative overflow-hidden"
          >
            <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-primarySoft opacity-50 blur-3xl" />
            <div className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full bg-goldSoft opacity-50 blur-3xl" />
            
            <div className="relative">
              <div className="flex items-center gap-3 mb-10">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl text-white shadow-lg" style={{ backgroundColor: BRAND.primary, boxShadow: `0 10px 25px rgba(14,42,71,0.25)` }}>
                  <Crown className="h-6 w-6" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-slate-500">企业级解决方案</div>
                  <div className="text-xl font-bold text-slate-900">永达汽车用户经营中台</div>
                </div>
              </div>
              
              <h1 className="text-4xl font-bold tracking-tight text-slate-950 mb-6 leading-tight">
                智能会员经营系统
              </h1>
              <p className="text-base leading-7 text-slate-600 mb-10 max-w-xl">
                通过 AI 驱动的会员经营平台，实现高价值会员保级、积分唤醒、权益激活的全流程自动化管理，提升会员价值与门店业绩。
              </p>
              
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3 mb-10">
                {[
                  { icon: Lock, title: "统一登录", desc: "多角色权限管理，支持总部、城市、门店三级视角" },
                  { icon: PenSquare, title: "智能配置", desc: "可视化活动配置，AI 自动生成策略方案" },
                  { icon: Download, title: "数据沉淀", desc: "完整的复盘报告与可复用 SOP 模板" }
                ].map((item, index) => (
                  <motion.div 
                    key={item.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.2, duration: 0.5 }}
                    className="rounded-2xl border border-slate-200 bg-slate-50 p-6 hover:bg-white hover:shadow-md transition-all duration-300"
                  >
                    <div className="h-12 w-12 rounded-xl flex items-center justify-center bg-primarySoft mb-4">
                      <item.icon className="h-6 w-6" style={{ color: BRAND.primary }} />
                    </div>
                    <div className="font-semibold text-slate-900 mb-2">{item.title}</div>
                    <div className="text-sm text-slate-600">{item.desc}</div>
                  </motion.div>
                ))}
              </div>
              
              <div className="space-y-3 text-sm text-slate-500">
                {[
                  "8 步完整经营流程",
                  "多渠道触达与补触达",
                  "实时数据分析与异常预警"
                ].map((item, index) => (
                  <motion.div 
                    key={item}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                    className="flex items-center gap-3"
                  >
                    <div className="h-6 w-6 rounded-full flex items-center justify-center bg-emerald-100">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    </div>
                    <span>{item}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="rounded-3xl border border-white/60 bg-white p-8 shadow-xl shadow-slate-200/40 lg:p-10 relative overflow-hidden"
          >
            <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-primarySoft opacity-30 blur-2xl" />
            <div className="relative">
              <div className="mx-auto max-w-md">
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.4 }}
                  className="mb-8 flex h-16 w-16 items-center justify-center rounded-2xl text-white shadow-lg mx-auto"
                  style={{ backgroundColor: BRAND.primary, boxShadow: `0 12px 24px rgba(14,42,71,0.3)` }}
                >
                  <LogIn className="h-6 w-6" />
                </motion.div>
                
                <h2 className="text-2xl font-bold tracking-tight text-slate-950 mb-3 text-center">经营账号登录</h2>
                <p className="text-sm text-slate-500 mb-8 text-center">演示账号已预置，选择角色后点击登录即可进入</p>
                
                <div className="mb-8">
                  <label className="block text-sm font-medium text-slate-700 mb-3">选择角色</label>
                  <RoleSwitcher role={role} setRole={setRole} />
                </div>
                
                <div className="space-y-4 mb-8">
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 text-sm"
                  >
                    <div className="text-xs text-slate-500 mb-1">账号</div>
                    <div className="font-medium text-slate-900">marketing_manager@yongda.com</div>
                  </motion.div>
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 text-sm"
                  >
                    <div className="text-xs text-slate-500 mb-1">当前角色</div>
                    <div className="font-medium text-slate-900">{role}</div>
                  </motion.div>
                </div>
                
                <motion.button 
                  whileHover={{ scale: 1.03, boxShadow: `0 12px 24px rgba(14,42,71,0.3)` }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onEnter} 
                  className="inline-flex w-full items-center justify-center gap-3 rounded-2xl px-6 py-4 text-sm font-semibold text-white shadow-lg hover:shadow-xl transition-all duration-300"
                  style={{ backgroundColor: BRAND.primary }}
                >
                  <LogIn className="h-5 w-5" />
                  登录并进入系统
                </motion.button>
                
                <div className="mt-6 text-center text-xs text-slate-500">
                  © 2026 永达汽车用户经营中台 | 版本 1.0.0
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </Shell>
  );
}

function InfoCard({ icon: Icon, title, desc }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
      <Icon className="h-5 w-5 text-slate-700" />
      <div className="mt-3 font-semibold text-slate-900">{title}</div>
      <div className="mt-2 text-sm text-slate-600">{desc}</div>
    </div>
  );
}

function AdvisorDashboard({ role, onBackHome, onOpenActivity, onOpenMember }) {
  const advisorMembers = members.filter(m => m.advisor.includes(role.replace('顾问', '')));
  return (
    <Shell>
      <div className="mx-auto max-w-[1500px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg">
          <div className="border-b border-slate-200 px-6 py-4 lg:px-8">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl text-white shadow-md" style={{ backgroundColor: BRAND.primary }}>
                  <UserCheck className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-slate-900">永达汽车用户经营中台</div>
                  <div className="text-xs text-slate-500">门店顾问工作台</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Pill tone="gold">{role}</Pill>
                <button onClick={onBackHome} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">
                  <ArrowRight className="h-4 w-4 rotate-180" />
                  返回首页
                </button>
              </div>
            </div>
          </div>
          <div className="p-6 lg:p-8">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
              <StatCard label="负责会员总数" value={advisorMembers.length} suffix="人" hint="专属服务的会员" />
              <StatCard label="待跟进会员" value={advisorMembers.filter(m => m.engagement === "待触达").length} suffix="人" hint="需要主动联系" accent="amber" />
              <StatCard label="高价值会员" value={advisorMembers.filter(m => m.level === "钻石会员" || m.level === "黑金会员").length} suffix="人" hint="钻石/黑金等级" />
              <StatCard label="本月已跟进" value={3} suffix="人" hint="已完成服务" />
            </div>

            <div className="grid grid-cols-1 gap-6 mb-8">
              <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-lg font-semibold text-slate-900">待跟进会员</div>
                  <Pill tone="rose">优先级高</Pill>
                </div>
                <div className="space-y-3">
                  {advisorMembers.map((member) => (
                    <motion.div 
                      key={member.id}
                      whileHover={{ scale: 1.01 }}
                      className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 hover:border-slate-300 hover:bg-white cursor-pointer"
                      onClick={() => onOpenMember(member)}
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full text-white" style={{ backgroundColor: BRAND.primary }}>
                          {member.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-semibold text-slate-900">{member.name}</div>
                          <div className="text-sm text-slate-600">{member.level} · {member.status}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Pill tone={member.tag === "高风险" ? "rose" : member.tag === "待唤醒" ? "amber" : "blue"}>{member.tag}</Pill>
                        <button className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50">
                          <Phone className="h-3.5 w-3.5" />
                          联系
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-lg font-semibold text-slate-900">今日待办</div>
                  <Pill tone="blue">3 项</Pill>
                </div>
                <div className="space-y-3">
                  <div className="flex gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" style={{ color: BRAND.primary }} />
                    <div>
                      <div className="font-semibold text-slate-900">联系张先生确认到店时间</div>
                      <div className="text-xs text-slate-500">10:00 - 11:00</div>
                    </div>
                  </div>
                  <div className="flex gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" style={{ color: BRAND.primary }} />
                    <div>
                      <div className="font-semibold text-slate-900">回传李女士跟进结果</div>
                      <div className="text-xs text-slate-500">14:00 - 15:00</div>
                    </div>
                  </div>
                  <div className="flex gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" style={{ color: BRAND.primary }} />
                    <div>
                      <div className="font-semibold text-slate-900">准备王先生的专属方案</div>
                      <div className="text-xs text-slate-500">16:00 - 17:00</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-lg font-semibold text-slate-900">会员服务记录</div>
                  <Pill tone="green">最近 7 天</Pill>
                </div>
                <div className="space-y-3">
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div className="font-semibold text-slate-900">陈女士</div>
                      <Pill tone="green">已完成</Pill>
                    </div>
                    <div className="mt-2 text-sm text-slate-600">电话沟通保级方案，确认到店时间</div>
                    <div className="mt-2 text-xs text-slate-500">2026-03-11 14:30</div>
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div className="font-semibold text-slate-900">王先生</div>
                      <Pill tone="blue">进行中</Pill>
                    </div>
                    <div className="mt-2 text-sm text-slate-600">发送积分兑换提醒，等待回复</div>
                    <div className="mt-2 text-xs text-slate-500">2026-03-10 10:15</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Shell>
  );
}

function BusinessCockpit({ onBackHome, onOpenActivity }) {
  return (
    <Shell>
      <div className="mx-auto max-w-[1500px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg">
          <div className="border-b border-slate-200 px-6 py-4 lg:px-8">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl text-white shadow-md" style={{ backgroundColor: BRAND.primary }}>
                  <LineChart className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-slate-900">永达汽车用户经营中台</div>
                  <div className="text-xs text-slate-500">经营驾驶舱</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Pill tone="gold">领导视角</Pill>
                <button onClick={onBackHome} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">
                  <ArrowRight className="h-4 w-4 rotate-180" />
                  返回首页
                </button>
              </div>
            </div>
          </div>
          <div className="p-6 lg:p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold tracking-tight text-slate-950 mb-2">经营数据总览</h1>
              <p className="text-sm text-slate-600">实时监控核心经营指标，支持领导决策</p>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 mb-8">
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-lg">
                <div className="text-sm text-slate-500 mb-2">会员保级率</div>
                <div className="text-4xl font-bold text-slate-900 mb-2">74.6%</div>
                <div className="flex items-center gap-2 text-sm text-emerald-600">
                  <ArrowRight className="h-4 w-4 rotate-[-45deg]" />
                  <span>同比提升 12.6%</span>
                </div>
              </div>
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-lg">
                <div className="text-sm text-slate-500 mb-2">积分消耗率</div>
                <div className="text-4xl font-bold text-slate-900 mb-2">42.3%</div>
                <div className="flex items-center gap-2 text-sm text-emerald-600">
                  <ArrowRight className="h-4 w-4 rotate-[-45deg]" />
                  <span>同比提升 18.3%</span>
                </div>
              </div>
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-lg">
                <div className="text-sm text-slate-500 mb-2">回厂率</div>
                <div className="text-4xl font-bold text-slate-900 mb-2">24.8%</div>
                <div className="flex items-center gap-2 text-sm text-emerald-600">
                  <ArrowRight className="h-4 w-4 rotate-[-45deg]" />
                  <span>同比提升 7.8%</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 mb-8">
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-slate-900">活动效果分析</h3>
                  <Pill tone="blue">月度</Pill>
                </div>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="font-semibold text-slate-900">高价值会员保级活动</span>
                      <span className="text-emerald-600">+12.6%</span>
                    </div>
                    <ProgressBar value={74.6} tone="brand" />
                  </div>
                  <div>
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="font-semibold text-slate-900">积分唤醒活动</span>
                      <span className="text-emerald-600">+8.3%</span>
                    </div>
                    <ProgressBar value={62.1} tone="gold" />
                  </div>
                  <div>
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="font-semibold text-slate-900">售后转化活动</span>
                      <span className="text-emerald-600">+5.2%</span>
                    </div>
                    <ProgressBar value={48.7} tone="blue" />
                  </div>
                </div>
              </div>
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-slate-900">区域表现</h3>
                  <Pill tone="gold">TOP 5</Pill>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50">
                    <div className="font-semibold text-slate-900">上海浦东店</div>
                    <div className="text-emerald-600 font-semibold">89.2%</div>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50">
                    <div className="font-semibold text-slate-900">杭州滨江店</div>
                    <div className="text-emerald-600 font-semibold">85.7%</div>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50">
                    <div className="font-semibold text-slate-900">上海虹桥店</div>
                    <div className="text-emerald-600 font-semibold">82.3%</div>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50">
                    <div className="font-semibold text-slate-900">杭州西湖店</div>
                    <div className="text-emerald-600 font-semibold">79.8%</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-lg mb-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-slate-900">重点项目监控</h3>
                <Pill tone="rose">需关注</Pill>
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div className="font-semibold text-slate-900 mb-2">高价值会员保级</div>
                  <div className="text-sm text-slate-600 mb-3">进行中 · 612 位会员</div>
                  <div className="flex items-center gap-2">
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '65%' }}></div>
                    </div>
                    <span className="text-xs font-semibold text-slate-700">65%</span>
                  </div>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div className="font-semibold text-slate-900 mb-2">积分唤醒计划</div>
                  <div className="text-sm text-slate-600 mb-3">进行中 · 1,245 位会员</div>
                  <div className="flex items-center gap-2">
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full" style={{ width: '42%' }}></div>
                    </div>
                    <span className="text-xs font-semibold text-slate-700">42%</span>
                  </div>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div className="font-semibold text-slate-900 mb-2">售后回厂激活</div>
                  <div className="text-sm text-slate-600 mb-3">计划中 · 预计 800 位会员</div>
                  <div className="flex items-center gap-2">
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div className="bg-amber-500 h-2 rounded-full" style={{ width: '15%' }}></div>
                    </div>
                    <span className="text-xs font-semibold text-slate-700">15%</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap justify-center gap-4">
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onOpenActivity}
                className="inline-flex items-center gap-2 rounded-2xl px-6 py-3 text-sm font-semibold text-white shadow-lg hover:-translate-y-0.5"
                style={{ backgroundColor: BRAND.primary, boxShadow: `0 12px 24px rgba(14,42,71,0.22)` }}
              >
                <Eye className="h-4 w-4" />
                查看详细经营数据
              </motion.button>
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 shadow-md"
              >
                <Download className="h-4 w-4" />
                导出汇报材料
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </Shell>
  );
}

function HomeScreen({ onOpenActivity, onOpenConfig, onOpenReport, role, onOpenMember, onOpenCockpit, onStartGuidedTour, onBackHome }) {
  if (role === "门店顾问") {
    return <AdvisorDashboard role={role} onBackHome={onBackHome} onOpenActivity={onOpenActivity} onOpenMember={onOpenMember} />;
  }
  return (
    <Shell>
      <div className="mx-auto max-w-[1500px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg">
          <div className="border-b border-slate-200 px-6 py-4 lg:px-8">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl text-white shadow-md" style={{ backgroundColor: BRAND.primary }}>
                  <Crown className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-slate-900">永达汽车用户经营中台</div>
                  <div className="text-xs text-slate-500">首页 / 经营活动中心</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Pill tone="gold">{role}</Pill>
                <button className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">
                  <Settings2 className="h-4 w-4" />
                  系统设置
                </button>
                <button onClick={onOpenCockpit} className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold text-white shadow-md hover:shadow-lg" style={{ backgroundColor: BRAND.primary }}>
                  <LineChart className="h-4 w-4" />
                  经营驾驶舱
                </button>
                <button onClick={onStartGuidedTour} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">
                  <Wand2 className="h-4 w-4" />
                  引导演示
                </button>
              </div>
            </div>
          </div>
          <div className="p-6 lg:p-8">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
              <StatCard label="本月进行中活动" value={12} suffix="个" hint="会员经营 / 售后转化 / 商城兑换" />
              <StatCard label="重点监控活动" value={3} suffix="个" hint="需人工审批或异常干预" accent="gold" />
              <StatCard label="高价值会员池" value={612} suffix="人" hint="30 天内将降级" />
              <StatCard label="待门店承接客户" value={85} suffix="人" hint="已进入一对一跟进池" />
            </div>

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.2fr_0.8fr] mb-8">
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-6">
                <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                  <div className="flex-1">
                    <div className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-600 ring-1 ring-slate-200 mb-4">
                      <Star className="h-4 w-4" style={{ color: BRAND.gold }} />
                      重点经营活动
                    </div>
                    <h2 className="text-2xl font-bold tracking-tight text-slate-950 mb-3">高价值会员保级与积分唤醒联动经营</h2>
                    <p className="text-sm leading-7 text-slate-600 mb-4 max-w-3xl">
                      面向“即将降级 + 高积分余额 + 低活跃”的高价值车主，自动完成人群识别、方案生成、活动执行、补触达与门店协同。
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {(role === "总部运营经理" || role === "城市运营") && (
                      <motion.button 
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={onOpenConfig}
                        className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                      >
                        <PenSquare className="h-4 w-4" />{role === "总部运营经理" ? "全国活动配置" : "区域活动配置"}
                      </motion.button>
                    )}
                    <motion.button 
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={onOpenActivity}
                      className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold text-white shadow-md hover:shadow-lg"
                      style={{ backgroundColor: BRAND.primary }}
                    >
                      <ArrowRight className="h-4 w-4" />进入详情
                    </motion.button>
                  </div>
                </div>
                <div className="mt-6"><LifecycleBar currentStep={4} /></div>
              </div>
              <TodoBoard role={role} />
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 mb-8">
              {dashboardCards.map((card) => (
                <motion.div 
                  key={card.title} 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="text-lg font-semibold text-slate-900">{card.title}</div>
                    <Pill tone={card.status === "进行中" ? "blue" : card.status === "已更新" ? "green" : "amber"}>{card.status}</Pill>
                  </div>
                  <div className="text-sm leading-6 text-slate-600">{card.desc}</div>
                </motion.div>
              ))}
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-lg font-semibold text-slate-900">系统提醒</div>
                  <Pill tone="rose">需关注</Pill>
                </div>
                <NoticeList />
              </div>
              <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <div className="text-lg font-semibold text-slate-900 mb-2">上周期复盘沉淀</div>
                    <div className="text-sm text-slate-600 mb-4">
                      支持直接查看导出报告与 SOP 模板，展示闭环最后一跳。
                    </div>
                  </div>
                  <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={onOpenReport}
                    className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    <Download className="h-4 w-4" />查看报告
                  </motion.button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Shell>
  );
}

function HeaderBar({ title, subtitle, role, extra }) {
  return (
    <div className="border-b border-slate-200 bg-white px-6 py-4 lg:px-8 shadow-sm">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl text-white shadow-lg" style={{ backgroundColor: BRAND.primary, boxShadow: `0 8px 16px rgba(14,42,71,0.2)` }}>
            <Crown className="h-6 w-6" />
          </div>
          <div>
            <div className="text-sm font-semibold text-slate-500">{subtitle}</div>
            <div className="text-xl font-bold text-slate-900">{title}</div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2">
            <div className="h-8 w-8 rounded-full flex items-center justify-center bg-primarySoft">
              <UserCheck className="h-4 w-4" style={{ color: BRAND.primary }} />
            </div>
            <div className="font-medium text-slate-900">{role}</div>
          </div>
          {extra}
        </div>
      </div>
    </div>
  );
}

function TopNav({ city, setCity, store, setStore, role, setRole, onBackHome, onOpenConfig, onOpenReport, currentScreen }) {
  return (
    <div className="border-b border-slate-200/80 bg-white px-6 py-4 lg:px-8 shadow-sm">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl text-white shadow-lg" style={{ backgroundColor: BRAND.primary, boxShadow: `0 8px 16px rgba(14,42,71,0.2)` }}>
            <Crown className="h-6 w-6" />
          </div>
          <div>
            <div className="text-sm font-semibold text-slate-500">企业级解决方案</div>
            <div className="text-xl font-bold text-slate-900">永达汽车用户经营中台</div>
            <div className="text-xs text-slate-500 mt-1">
              <span>经营活动中心</span>
              {currentScreen && <span> / {currentScreen}</span>}
            </div>
          </div>
        </div>
        <div className="flex flex-1 flex-wrap items-center gap-4 xl:justify-end">
          <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm shadow-sm hover:shadow-md transition-all duration-300">
            <Search className="h-4 w-4 text-slate-500" />
            <input 
              type="text" 
              placeholder="搜索会员 / 活动 / 门店" 
              className="bg-transparent text-slate-700 outline-none min-w-[200px]"
            />
          </div>
          <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm shadow-sm hover:shadow-md transition-all duration-300">
            <MapPin className="h-4 w-4 text-slate-500" />
            <select value={city} onChange={(e) => setCity(e.target.value)} className="bg-transparent text-slate-700 outline-none">
              {cityOptions.map((item) => <option key={item}>{item}</option>)}
            </select>
          </div>
          <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm shadow-sm hover:shadow-md transition-all duration-300">
            <Building2 className="h-4 w-4 text-slate-500" />
            <select value={store} onChange={(e) => setStore(e.target.value)} className="bg-transparent text-slate-700 outline-none">
              {storeOptions.map((item) => <option key={item}>{item}</option>)}
            </select>
          </div>
          <RoleSwitcher role={role} setRole={setRole} />
          <button onClick={onBackHome} className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 shadow-sm hover:shadow-md transition-all duration-300">
            <ArrowRight className="h-4 w-4 rotate-180" />返回首页
          </button>
          {(role === "总部运营经理" || role === "城市运营") && (
            <button onClick={onOpenConfig} className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 shadow-sm hover:shadow-md transition-all duration-300">
              <PenSquare className="h-4 w-4" />{role === "总部运营经理" ? "全国活动配置" : "区域活动配置"}
            </button>
          )}
          <button onClick={onOpenReport} className="inline-flex items-center gap-2 rounded-2xl px-5 py-2 text-sm font-semibold text-white shadow-lg hover:shadow-xl transition-all duration-300" style={{ backgroundColor: BRAND.primary }}>
            <Download className="h-4 w-4" />复盘导出
          </button>
        </div>
      </div>
    </div>
  );
}

function VersionComparison({ original, current }) {
  return (
    <div className="mt-6 rounded-xl border border-slate-200 bg-white p-6">
      <h4 className="text-lg font-semibold text-slate-900 mb-4">版本对比</h4>
      <div className="space-y-4">
        <div className="flex items-start gap-4">
          <div className="w-1/2">
            <div className="text-sm font-medium text-slate-500 mb-2">原始方案</div>
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
              <div className="text-sm">积分兑换门槛：{original.threshold.toLocaleString()} 积分</div>
              <div className="text-sm mt-2">门店顾问承接：{original.extraStoreSupport ? '是' : '否'}</div>
            </div>
          </div>
          <div className="w-1/2">
            <div className="text-sm font-medium text-slate-500 mb-2">调整后方案</div>
            <div className="rounded-lg border border-slate-200 bg-brandSoft p-4">
              <div className="text-sm">积分兑换门槛：{current.threshold.toLocaleString()} 积分</div>
              <div className="text-sm mt-2">门店顾问承接：{current.extraStoreSupport ? '是' : '否'}</div>
            </div>
          </div>
        </div>
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
            <div className="text-sm text-amber-800">
              <div className="font-medium">方案调整影响</div>
              <div className="mt-1">积分门槛调整为 {current.threshold.toLocaleString()} 积分后，预计会增加 {Math.round((current.threshold < original.threshold ? 15 : -10))}% 的兑换率，但会增加 {Math.round((current.threshold < original.threshold ? 8 : 0))}% 的权益成本。</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ApprovalModal({ open, onClose, onApprove }) {
  const [threshold, setThreshold] = useState(6000);
  const [extraStoreSupport, setExtraStoreSupport] = useState(true);
  const originalValues = { threshold: 8000, extraStoreSupport: false };
  if (!open) return null;
  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-sm"
      >
        <motion.div 
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="w-full max-w-3xl rounded-2xl border border-white/40 bg-white p-6 shadow-2xl max-h-[90vh] overflow-y-auto relative"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-primarySoft/10 to-transparent rounded-full -translate-y-32 translate-x-32" />
          <div className="flex items-start justify-between gap-4 relative z-10">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ring-1" style={{ backgroundColor: BRAND.goldSoft, color: "#9A6B16", borderColor: "#E8D19B" }}>
                <ClipboardCheck className="h-4 w-4" />
                审批节点
              </div>
              <h3 className="mt-3 text-2xl font-bold tracking-tight text-slate-950">确认最终权益方案</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">用于演示“AI 出方案，人工做决策”。审批通过后，指标会联动跳动，会员状态进入下一阶段。</p>
            </div>
            <motion.button 
              whileHover={{ scale: 1.1, backgroundColor: "#f8fafc" }}
              whileTap={{ scale: 0.95 }}
              onClick={onClose} 
              className="rounded-xl border border-slate-200 p-2 text-slate-500 hover:bg-slate-50 transition-all duration-200"
            >
              <X className="h-4 w-4" />
            </motion.button>
          </div>
          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 relative z-10">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-6 shadow-sm"
            >
              <div className="text-sm font-semibold text-slate-900">推荐方案</div>
              <motion.div 
                whileHover={{ scale: 1.02 }}
                className="mt-3 rounded-2xl p-5 text-white shadow-lg transition-all duration-200"
                style={{ backgroundColor: BRAND.primary }}
              >
                <div className="text-base font-semibold">方案 C｜保级任务包 + 露营礼包</div>
                <div className="mt-2 text-sm text-slate-200">身份感 + 任务感 + 场景权益，适合激活高价值会员。</div>
              </motion.div>
              <div className="mt-4 space-y-3 text-sm text-slate-600">
                <div className="flex items-center justify-between">
                  <span>预估打开率</span>
                  <span className="font-semibold text-slate-900">45%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>预估核销率</span>
                  <span className="font-semibold text-slate-900">22%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>预估回厂率</span>
                  <span className="font-semibold text-slate-900">18%</span>
                </div>
              </div>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <div className="text-sm font-semibold text-slate-900">审批调整</div>
              <div className="mt-4 space-y-4">
                <label className="block">
                  <span className="mb-2 block text-xs font-medium uppercase tracking-[0.16em] text-slate-400">积分兑换门槛</span>
                  <input 
                    type="range" 
                    min="4000" 
                    max="10000" 
                    step="500" 
                    value={threshold} 
                    onChange={(e) => setThreshold(Number(e.target.value))} 
                    className="w-full h-2 bg-slate-200 rounded-full appearance-none cursor-pointer"
                    style={{
                      background: `linear-gradient(to right, ${BRAND.primary} 0%, ${BRAND.primary} ${((threshold - 4000) / 6000) * 100}%, #e2e8f0 ${((threshold - 4000) / 6000) * 100}%, #e2e8f0 100%)`
                    }}
                  />
                  <div className="mt-3 text-sm text-slate-700">
                    当前设置：
                    <span className="font-semibold text-slate-900 ml-1">{threshold.toLocaleString()} 积分</span>
                  </div>
                </label>
                <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 hover:bg-white transition-all duration-200">
                  <input 
                    type="checkbox" 
                    checked={extraStoreSupport} 
                    onChange={() => setExtraStoreSupport((v) => !v)} 
                    className="w-4 h-4 text-primary rounded border-slate-300 focus:ring-primary"
                  />
                  增加重点城市门店顾问承接资源
                </label>
              </div>
            </motion.div>
          </div>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <VersionComparison 
              original={originalValues} 
              current={{ threshold, extraStoreSupport }} 
            />
          </motion.div>
          <div className="mt-6 flex flex-wrap items-center justify-end gap-3 relative z-10">
            <motion.button 
              whileHover={{ scale: 1.03, boxShadow: "0 8px 16px rgba(14,42,71,0.1)" }}
              whileTap={{ scale: 0.98 }}
              onClick={onClose} 
              className="rounded-2xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-all duration-200"
            >
              取消
            </motion.button>
            <motion.button 
              whileHover={{ scale: 1.03, boxShadow: "0 12px 24px rgba(14,42,71,0.25)" }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onApprove({ threshold, extraStoreSupport })} 
              className="rounded-2xl px-6 py-3 text-sm font-semibold text-white shadow-md hover:shadow-lg transition-all duration-200"
              style={{ backgroundColor: BRAND.primary }}
            >
              审批通过并应用
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

function SendDrawer({ open, onClose, activeIndex, mode = "首轮" }) {
  if (!open) return null;
  const messages = mode === "首轮"
    ? steps[3].messages
    : [
        { channel: "补发短信", text: "尊贵会员您好，您的专属保级任务仍在限时开放，积分可直兑露营礼包，并可一键预约到店服务。" },
        { channel: "补发 App Push", text: "仅剩 24 小时，您的会员等级保留任务待完成，点击即可查看并预约到店。" },
        { channel: "顾问私信", text: "您好，我是永达顾问，已为您预留专属权益和到店时间，可直接回复我完成预约。" },
      ];
  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-40 bg-slate-950/20 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.div 
        initial={{ x: 420 }}
        animate={{ x: 0 }}
        exit={{ x: 420 }}
        transition={{ type: "spring", stiffness: 220, damping: 22 }}
        className="fixed right-0 top-0 z-50 h-full w-full max-w-md border-l border-slate-200 bg-white shadow-2xl overflow-y-auto"
      >
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 bg-gradient-to-r from-white to-slate-50">
          <div>
            <div className="text-sm font-semibold text-slate-900">{mode}触达发送模拟</div>
            <div className="text-xs text-slate-500">展示短信 / App Push / 私信执行过程</div>
          </div>
          <motion.button 
            whileHover={{ scale: 1.1, backgroundColor: "#f8fafc" }}
            whileTap={{ scale: 0.95 }}
            onClick={onClose} 
            className="rounded-2xl border border-slate-200 p-2 text-slate-500 hover:bg-slate-50 transition-all duration-200"
          >
            <X className="h-4 w-4" />
          </motion.button>
        </div>
        <div className="space-y-4 p-6">
          {messages.map((msg, index) => {
            const done = index < activeIndex;
            const current = index === activeIndex;
            return (
              <motion.div 
                key={msg.channel}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                className={cn("rounded-3xl border p-6 transition-all duration-300", current ? "text-white shadow-lg" : "border-slate-200 bg-slate-50 hover:bg-white")}
                style={current ? { backgroundColor: BRAND.primary, borderColor: BRAND.primary } : undefined}
              >
                <div className="flex items-center justify-between">
                  <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold ring-1 ring-inset ring-white/15">
                    <Send className="h-3.5 w-3.5" />
                    {msg.channel}
                  </div>
                  <Pill tone={done ? "green" : current ? "blue" : "slate"}>
                    {done ? "已发送" : current ? "发送中" : "待发送"}
                  </Pill>
                </div>
                <div className={cn("mt-4 text-sm leading-6", current ? "text-slate-200" : "text-slate-700")}>
                  {msg.text}
                </div>
                {current && (
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="mt-4 flex justify-center"
                  >
                    <div className="h-2 w-2 rounded-full bg-white/60 animate-pulse" />
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

function MemberDrawer({ open, onClose, member }) {
  if (!open || !member) return null;
  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-40 bg-slate-950/20 backdrop-blur-sm" onClick={onClose} />
      <motion.div 
        initial={{ x: 420 }}
        animate={{ x: 0 }}
        exit={{ x: 420 }}
        transition={{ type: "spring", stiffness: 220, damping: 22 }}
        className="fixed right-0 top-0 z-50 h-full w-full max-w-md border-l border-slate-200 bg-white shadow-2xl overflow-y-auto"
      >
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 bg-gradient-to-r from-white to-slate-50">
          <div>
            <div className="text-sm font-semibold text-slate-900">会员详情</div>
            <div className="text-xs text-slate-500">查看会员完整旅程</div>
          </div>
          <button 
            onClick={onClose} 
            className="rounded-2xl border border-slate-200 p-2 text-slate-500 hover:bg-slate-50 transition-all duration-200"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="p-6 space-y-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-6 shadow-sm relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-primarySoft/20 to-transparent rounded-full -translate-y-20 translate-x-20" />
            <div className="flex items-center justify-between gap-3 relative z-10">
              <div>
                <h3 className="text-xl font-bold text-slate-900">{member.name}</h3>
                <div className="mt-2 flex items-center gap-2">
                  <Pill tone="gold">{member.level}</Pill>
                  <Pill tone={member.tag === "高风险" ? "rose" : member.tag === "待唤醒" ? "amber" : "blue"}>{member.tag}</Pill>
                </div>
              </div>
              <div className="flex h-14 w-14 items-center justify-center rounded-full text-white shadow-lg" style={{ backgroundColor: BRAND.primary }}>
                {member.name.charAt(0)}
              </div>
            </div>
            <div className="mt-6 grid grid-cols-2 gap-4 text-sm relative z-10">
              <motion.div 
                whileHover={{ y: -2, boxShadow: "0 8px 16px rgba(14,42,71,0.1)" }}
                className="rounded-2xl border border-slate-200 bg-white px-4 py-3 transition-all duration-200"
              >
                <div className="text-xs text-slate-500">积分余额</div>
                <div className="font-semibold text-slate-900">{member.score.toLocaleString()}</div>
              </motion.div>
              <motion.div 
                whileHover={{ y: -2, boxShadow: "0 8px 16px rgba(14,42,71,0.1)" }}
                className="rounded-2xl border border-slate-200 bg-white px-4 py-3 transition-all duration-200"
              >
                <div className="text-xs text-slate-500">状态</div>
                <div className="font-semibold text-slate-900">{member.status}</div>
              </motion.div>
              <motion.div 
                whileHover={{ y: -2, boxShadow: "0 8px 16px rgba(14,42,71,0.1)" }}
                className="rounded-2xl border border-slate-200 bg-white px-4 py-3 transition-all duration-200"
              >
                <div className="text-xs text-slate-500">城市</div>
                <div className="font-semibold text-slate-900">{member.city}</div>
              </motion.div>
              <motion.div 
                whileHover={{ y: -2, boxShadow: "0 8px 16px rgba(14,42,71,0.1)" }}
                className="rounded-2xl border border-slate-200 bg-white px-4 py-3 transition-all duration-200"
              >
                <div className="text-xs text-slate-500">门店</div>
                <div className="font-semibold text-slate-900">{member.store}</div>
              </motion.div>
              <motion.div 
                whileHover={{ y: -2, boxShadow: "0 8px 16px rgba(14,42,71,0.1)" }}
                className="rounded-2xl border border-slate-200 bg-white px-4 py-3 col-span-2 transition-all duration-200"
              >
                <div className="text-xs text-slate-500">专属顾问</div>
                <div className="font-semibold text-slate-900">{member.advisor}</div>
              </motion.div>
            </div>
          </motion.div>
          
          <div>
            <h4 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <LineChart className="h-5 w-5" style={{ color: BRAND.primary }} />
              会员旅程
            </h4>
            <div className="space-y-4">
              {member.journey.map((item, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex gap-4"
                >
                  <div className="flex flex-col items-center">
                    <motion.div 
                      whileHover={{ scale: 1.1 }}
                      className="flex h-8 w-8 items-center justify-center rounded-full text-white shadow-sm transition-all duration-200"
                      style={{ backgroundColor: item.status === "完成" ? "#10B981" : item.status === "进行中" ? BRAND.primary : "#94A3B8" }}
                    >
                      {item.status === "完成" ? <CheckCircle2 className="h-4 w-4" /> : <Bell className="h-4 w-4" />}
                    </motion.div>
                    {index < member.journey.length - 1 && <div className="h-full w-0.5 bg-slate-200 my-2" />}
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-semibold text-slate-900">{item.date}</div>
                    <div className="mt-1 text-sm text-slate-600">{item.action}</div>
                    <div className="mt-1 text-xs">
                      <Pill tone={item.status === "完成" ? "green" : item.status === "进行中" ? "blue" : "slate"}>{item.status}</Pill>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
          >
            <h4 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <Star className="h-5 w-5" style={{ color: BRAND.gold }} />
              会员偏好
            </h4>
            <div className="flex flex-wrap gap-2">
              {member.preferences.map((pref, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Pill tone="brand">{pref}</Pill>
                </motion.div>
              ))}
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
          >
            <h4 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <Building2 className="h-5 w-5" style={{ color: BRAND.primary }} />
              车辆信息
            </h4>
            <div className="space-y-3">
              {member.vehicles.map((vehicle, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -2, boxShadow: "0 8px 16px rgba(14,42,71,0.1)" }}
                  className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm transition-all duration-200"
                >
                  <Building2 className="h-4 w-4 text-slate-500" />
                  <span className="font-semibold text-slate-900">{vehicle}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
          
          <div className="flex flex-wrap gap-3">
            <motion.button 
              whileHover={{ scale: 1.03, boxShadow: "0 8px 16px rgba(14,42,71,0.15)" }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-all duration-200"
            >
              <Bell className="h-4 w-4" />发送提醒
            </motion.button>
            <motion.button 
              whileHover={{ scale: 1.03, boxShadow: "0 8px 16px rgba(14,42,71,0.25)" }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center gap-2 rounded-2xl px-4 py-2 text-sm font-semibold text-white shadow-md hover:shadow-lg transition-all duration-200"
              style={{ backgroundColor: BRAND.primary }}
            >
              <UserCheck className="h-4 w-4" />分配顾问
            </motion.button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

function GuidedTour({ open, onClose, steps, currentStep = 0 }) {
  if (!open || !steps || steps.length === 0) return null;
  
  const step = steps[currentStep];
  if (!step) return null;
  
  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm"
        onClick={onClose}
      >
        <div className="fixed inset-0 pointer-events-none">
          <div 
            className="absolute" 
            style={{
              top: step.top,
              left: step.left,
              width: step.width,
              height: step.height,
              borderRadius: '8px',
              boxShadow: `0 0 0 2px ${BRAND.primary}, 0 0 0 100vmax rgba(0,0,0,0.5)`
            }}
          />
        </div>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed z-50 max-w-md p-6 rounded-2xl bg-white shadow-2xl"
          style={{
            top: step.overlayTop,
            left: step.overlayLeft
          }}
        >
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full text-white flex-shrink-0" style={{ backgroundColor: BRAND.primary }}>
              {currentStep + 1}
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-slate-900 mb-2">{step.title}</h3>
              <p className="text-sm text-slate-600 mb-4">{step.description}</p>
              <div className="flex items-center justify-between">
                <button 
                  onClick={onClose}
                  className="text-sm text-slate-500 hover:text-slate-700"
                >
                  跳过
                </button>
                <div className="flex items-center gap-2">
                  {currentStep > 0 && (
                    <button 
                      onClick={() => step.onPrevious()}
                      className="px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 rounded-lg"
                    >
                      上一步
                    </button>
                  )}
                  {currentStep < steps.length - 1 ? (
                    <button 
                      onClick={() => step.onNext()}
                      className="px-4 py-2 text-sm font-semibold text-white bg-primary rounded-lg"
                      style={{ backgroundColor: BRAND.primary }}
                    >
                      下一步
                    </button>
                  ) : (
                    <button 
                      onClick={onClose}
                      className="px-4 py-2 text-sm font-semibold text-white bg-primary rounded-lg"
                      style={{ backgroundColor: BRAND.primary }}
                    >
                      完成
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

function Field({ label, value }) {
  return (
    <div>
      <div className="mb-2 text-xs font-medium uppercase tracking-[0.16em] text-slate-400">{label}</div>
      <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-700">{value}</div>
    </div>
  );
}

function Rule({ children }) {
  return <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">{children}</div>;
}

function ConfigScreen({ onBackHome, onOpenDetail, role }) {
  if (role === "门店顾问") {
    return (
      <Shell>
        <div className="mx-auto max-w-[1500px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          <div className="overflow-hidden rounded-[36px] border border-white/60 bg-white/75 shadow-2xl shadow-slate-200/60 backdrop-blur-xl">
            <HeaderBar title="权限提示" subtitle="您没有活动配置权限" extra={null} />
            <div className="p-6 lg:p-8">
              <div className="flex flex-col items-center justify-center py-12">
                <AlertTriangle className="h-16 w-16 text-amber-500 mb-6" />
                <h3 className="text-2xl font-bold text-slate-900 mb-4">无配置权限</h3>
                <p className="text-center text-sm text-slate-600 max-w-md mb-8">
                  门店顾问无活动配置权限，配置权限由总部运营经理和城市运营负责。您可以通过个人工作台查看和执行会员跟进任务。
                </p>
                <button 
                  onClick={onBackHome}
                  className="inline-flex items-center gap-2 rounded-2xl px-6 py-3 text-sm font-semibold text-white shadow-lg hover:-translate-y-0.5"
                  style={{ backgroundColor: BRAND.primary, boxShadow: `0 12px 24px rgba(14,42,71,0.22)` }}
                >
                  <ArrowRight className="h-4 w-4 rotate-180" />返回首页
                </button>
              </div>
            </div>
          </div>
        </div>
      </Shell>
    );
  }
  
  return (
    <Shell>
      <div className="mx-auto max-w-[1500px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <div className="overflow-hidden rounded-[36px] border border-white/60 bg-white/75 shadow-2xl shadow-slate-200/60 backdrop-blur-xl">
          <HeaderBar title={role === "总部运营经理" ? "全国经营活动配置中心" : "区域经营活动配置中心"} subtitle={role === "总部运营经理" ? "创建 / 编辑 / 预览全国营销活动" : "创建 / 编辑 / 预览区域营销活动"} extra={<button onClick={onOpenDetail} className="inline-flex items-center gap-2 rounded-2xl px-4 py-2 text-sm font-semibold text-white" style={{ backgroundColor: BRAND.primary }}><Eye className="h-4 w-4" />查看生成后的活动详情</button>} />
          <div className="grid grid-cols-1 gap-0 xl:grid-cols-[420px_minmax(0,1fr)]">
            <aside className="border-b border-slate-200/80 bg-slate-50/70 p-6 xl:border-b-0 xl:border-r">
              <div className="space-y-5">
                <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="flex items-center gap-2 text-sm font-semibold text-slate-900"><Settings2 className="h-4 w-4" />基础配置</div>
                  <div className="mt-4 space-y-4 text-sm">
                    <Field label="活动名称" value="高价值会员保级与积分唤醒联动经营" />
                    <Field label="经营目标" value="保级 + 积分消耗 + 权益激活 + 回厂增长" />
                    <Field label="活动周期" value="2026/03/12 - 2026/03/31" />
                    <Field label="适用渠道" value="短信 / App Push / 企微 / 门店承接" />
                    {role === "总部运营经理" && (
                      <Field label="适用范围" value="全国" />
                    )}
                    {role === "城市运营" && (
                      <Field label="适用范围" value="区域内" />
                    )}
                  </div>
                </div>
                <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="flex items-center gap-2 text-sm font-semibold text-slate-900"><Users className="h-4 w-4" />人群规则</div>
                  <div className="mt-4 space-y-3"><Rule>30 天内即将降级</Rule><Rule>高积分余额 &gt; 5,000 分</Rule><Rule>近 90 天无回厂 / 无兑换 / 无权益核销</Rule><Rule>高价值会员等级：白金及以上</Rule></div>
                </div>
                <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="flex items-center gap-2 text-sm font-semibold text-slate-900"><Gift className="h-4 w-4" />权益配置</div>
                  <div className="mt-4 space-y-4 text-sm">
                    <Field label="主权益" value="保级任务包 + 露营礼包" />
                    <Field label="兑换门槛" value="6,000 积分" />
                    <Field label="补充权益" value="保养券 / 洗车券 / 到店预约权益" />
                  </div>
                </div>
              </div>
            </aside>
            <main className="p-6 lg:p-8">
              <SectionTitle icon={Wand2} title={role === "总部运营经理" ? "全国经营活动编排预览" : "区域经营活动编排预览"} desc={role === "总部运营经理" ? "展示全国活动如何通过表单配置生成：输入目标、人群、权益与触达规则后，由 AI 自动生成策略、文案与执行编排。" : "展示区域活动如何通过表单配置生成：输入目标、人群、权益与触达规则后，由 AI 自动生成策略、文案与执行编排。"} action={<Pill tone="purple">表单 → 活动</Pill>} />
              <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-2">
                <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="flex items-center justify-between"><h3 className="text-lg font-semibold text-slate-900">触达与补触达规则</h3><Pill tone="green">自动生成</Pill></div>
                  <div className="mt-4 space-y-3"><Rule>首轮：短信 + App Push + 企微私信</Rule><Rule>48 小时未响应：自动补发解释型文案</Rule><Rule>已兑换未核销：自动推送到店预约入口</Rule><Rule>已打开未兑换异常：升级门店顾问跟进</Rule></div>
                </div>
                <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="flex items-center justify-between"><h3 className="text-lg font-semibold text-slate-900">AI 生成结果</h3><Pill tone="brand">可预览</Pill></div>
                  <div className="mt-4 space-y-3"><Rule>已生成 3 套策略方案并推荐方案 C</Rule><Rule>已生成短信 / App Push / 企微文案</Rule><Rule>已预估核销率 / 回厂率 / 积分消耗率</Rule><Rule>已自动生成门店协同触发条件</Rule></div>
                </div>
              </div>
              <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-[0.92fr_1.08fr]">
                <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="flex items-center justify-between"><h3 className="text-lg font-semibold text-slate-900">预估经营规模</h3><Pill tone="gold">生成前校验</Pill></div>
                  <div className="mt-4 grid grid-cols-2 gap-4">
                    <MetricMini label="预估目标会员" value={role === "总部运营经理" ? "612" : "156"} unit="人" />
                    <MetricMini label="预估积分消耗" value={role === "总部运营经理" ? "518" : "132"} unit="万" />
                    <MetricMini label="预估回厂增量" value={role === "总部运营经理" ? "112" : "28"} unit="单" />
                    <MetricMini label="预估权益成本" value={role === "总部运营经理" ? "8.6" : "2.2"} unit="万" />
                  </div>
                </div>
                <div className="rounded-[28px] border border-slate-200 p-6 text-white shadow-sm" style={{ backgroundColor: BRAND.primary }}>
                  <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div>
                      <div className="text-lg font-semibold text-white">配置完成后生成的经营活动对象</div>
                      <div className="mt-2 text-sm text-slate-300">系统会将表单配置翻译成标准化活动模板，并同步到经营执行中心。</div>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      <button className="inline-flex items-center gap-2 rounded-2xl bg-white/10 px-4 py-2 text-sm font-semibold text-white ring-1 ring-white/15"><Save className="h-4 w-4" />保存草稿</button>
                      <button onClick={onBackHome} className="inline-flex items-center gap-2 rounded-2xl bg-white px-4 py-2 text-sm font-semibold text-slate-950"><ArrowRight className="h-4 w-4 rotate-180" />返回首页</button>
                      <button onClick={onOpenDetail} className="inline-flex items-center gap-2 rounded-2xl bg-[#C9A45C] px-4 py-2 text-sm font-semibold text-slate-950"><Eye className="h-4 w-4" />进入活动详情</button>
                    </div>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>
    </Shell>
  );
}

function MetricMini({ label, value, unit }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <div className="text-xs text-slate-500">{label}</div>
      <div className="mt-2 flex items-end gap-1"><span className="text-2xl font-bold text-slate-900">{value}</span><span className="pb-0.5 text-sm text-slate-500">{unit}</span></div>
    </div>
  );
}

function ReportScreen({ onBackDetail, onBackHome, metrics }) {
  return (
    <Shell>
      <div className="mx-auto max-w-[1500px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <div className="overflow-hidden rounded-[36px] border border-white/60 bg-white/75 shadow-2xl shadow-slate-200/60 backdrop-blur-xl">
          <HeaderBar title="经营复盘与模板沉淀中心" subtitle="报告 / 模板 / 门店清单" extra={<div className="flex gap-3"><button onClick={onBackHome} className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700"><ArrowRight className="h-4 w-4 rotate-180" />返回首页</button><button onClick={onBackDetail} className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700"><Eye className="h-4 w-4" />回到活动详情</button></div>} />
          <div className="p-6 lg:p-8">
            <SectionTitle icon={FileText} title="导出物与 SOP 沉淀" desc="活动结束后，系统不仅生成复盘报告，还会同步输出 SOP 模板和门店承接清单，方便长期复用。" action={<Pill tone="green">闭环收口页</Pill>} />
            <div className="mt-6"><KpiBoard metrics={metrics} /></div>
            <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-[1fr_1fr]">
              <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between"><h3 className="text-lg font-semibold text-slate-900">可导出文件</h3><Pill tone="brand">一键导出</Pill></div>
                <div className="mt-5 space-y-3">
                  {exportedFiles.map((file) => (
                    <div key={file.name} className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                      <div className="flex items-center justify-between gap-3"><div><div className="font-semibold text-slate-900">{file.name}</div><div className="mt-2 text-sm leading-6 text-slate-600">{file.desc}</div></div><Pill tone={file.tag.includes("PDF") ? "rose" : file.tag.includes("SOP") ? "purple" : "green"}>{file.tag}</Pill></div>
                      <div className="mt-4 flex flex-wrap gap-3"><button className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700"><Eye className="h-4 w-4" />预览</button><button className="inline-flex items-center gap-2 rounded-2xl px-4 py-2 text-sm font-semibold text-white" style={{ backgroundColor: BRAND.primary }}><Download className="h-4 w-4" />导出</button></div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between"><h3 className="text-lg font-semibold text-slate-900">沉淀模板</h3><Pill tone="gold">可复用</Pill></div>
                <div className="mt-4 space-y-3">
                  <Rule>高价值会员保级 SOP 模板</Rule>
                  <Rule>积分唤醒策略组合</Rule>
                  <Rule>异常升级门店承接流程</Rule>
                  <Rule>多渠道触达节奏模板</Rule>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Shell>
  );
}

function App() {
  const [screen, setScreen] = useState("login");
  const [role, setRole] = useState(roleOptions[0]);
  const [city, setCity] = useState(cityOptions[0]);
  const [store, setStore] = useState(storeOptions[0]);
  const [activeStep, setActiveStep] = useState(3);
  const [showApproval, setShowApproval] = useState(false);
  const [showSend, setShowSend] = useState(false);
  const [showReSend, setShowReSend] = useState(false);
  const [sendIndex, setSendIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [showMemberDrawer, setShowMemberDrawer] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [showGuidedTour, setShowGuidedTour] = useState(false);
  const [currentTourStep, setCurrentTourStep] = useState(0);
  
  const metrics = useMemo(() => ({
    保级率: 74.6,
    积分消耗率: 42.3,
    权益核销率: 30.4,
    回厂率: 24.8,
    活跃率: 43.1,
  }), []);

  useEffect(() => {
    if (showSend) {
      const timer = setTimeout(() => {
        setSendIndex((i) => (i < 3 ? i + 1 : 3));
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [showSend]);

  const handleApprove = () => {
    setShowApproval(false);
    setIsLoading(true);
    setTimeout(() => {
      setActiveStep(4);
      setShowSend(true);
      setIsLoading(false);
    }, 800);
  };

  const handleBackToHome = () => {
    setIsLoading(true);
    setTimeout(() => {
      setScreen("home");
      setIsLoading(false);
    }, 300);
  };

  const handleOpenActivity = () => {
    setIsLoading(true);
    setTimeout(() => {
      setScreen("activity");
      setIsLoading(false);
    }, 300);
  };

  const handleOpenConfig = () => {
    setIsLoading(true);
    setTimeout(() => {
      setScreen("config");
      setIsLoading(false);
    }, 300);
  };

  const handleOpenReport = () => {
    setIsLoading(true);
    setTimeout(() => {
      setScreen("report");
      setIsLoading(false);
    }, 300);
  };

  const handleEnter = () => {
    setIsLoading(true);
    setTimeout(() => {
      setScreen("home");
      setIsLoading(false);
    }, 800);
  };

  const handleOpenCockpit = () => {
    setIsLoading(true);
    setTimeout(() => {
      setScreen("cockpit");
      setIsLoading(false);
    }, 300);
  };

  const tourSteps = [
    {
      title: "经营驾驶舱",
      description: "查看整体经营数据总览，适合领导汇报时快速了解核心指标。",
      top: '100px',
      left: '800px',
      width: '200px',
      height: '40px',
      overlayTop: '160px',
      overlayLeft: '800px',
      onNext: () => setCurrentTourStep(1),
      onPrevious: () => setCurrentTourStep(0)
    },
    {
      title: "会员列表",
      description: "点击会员查看详细信息和完整旅程，了解会员状态和历史行为。",
      top: '300px',
      left: '400px',
      width: '300px',
      height: '80px',
      overlayTop: '400px',
      overlayLeft: '400px',
      onNext: () => setCurrentTourStep(2),
      onPrevious: () => setCurrentTourStep(0)
    },
    {
      title: "审批流程",
      description: "查看审批流版本对比，了解方案调整前后的差异。",
      top: '400px',
      left: '400px',
      width: '200px',
      height: '40px',
      overlayTop: '460px',
      overlayLeft: '400px',
      onNext: () => setCurrentTourStep(3),
      onPrevious: () => setCurrentTourStep(1)
    },
    {
      title: "门店顾问工作台",
      description: "切换到门店顾问视角，查看专属的会员服务界面。",
      top: '100px',
      left: '400px',
      width: '150px',
      height: '40px',
      overlayTop: '160px',
      overlayLeft: '400px',
      onNext: () => setCurrentTourStep(0),
      onPrevious: () => setCurrentTourStep(2)
    }
  ];

  const handleStartGuidedTour = () => {
    setCurrentTourStep(0);
    setShowGuidedTour(true);
  };

  if (screen === "login") {
    return <LoginScreen onEnter={handleEnter} role={role} setRole={setRole} />;
  }

  if (screen === "home") {
    return <HomeScreen onOpenActivity={handleOpenActivity} onOpenConfig={handleOpenConfig} onOpenReport={handleOpenReport} role={role} onOpenMember={(member) => {
      setSelectedMember(member);
      setShowMemberDrawer(true);
    }} onOpenCockpit={handleOpenCockpit} onStartGuidedTour={handleStartGuidedTour} onBackHome={handleBackToHome} />;
  }

  if (screen === "cockpit") {
    return <BusinessCockpit onBackHome={() => setScreen("home")} onOpenActivity={handleOpenActivity} />;
  }

  if (screen === "config") {
    return <ConfigScreen onBackHome={handleBackToHome} onOpenDetail={handleOpenActivity} role={role} />;
  }

  if (screen === "report") {
    return <ReportScreen onBackDetail={handleOpenActivity} onBackHome={handleBackToHome} metrics={metrics} />;
  }

  return (
    <Shell>
      {isLoading && <Loading />}
      <div className="mx-auto max-w-[1500px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <div className="overflow-hidden rounded-[36px] border border-white/60 bg-white/75 shadow-2xl shadow-slate-200/60 backdrop-blur-xl">
          <TopNav 
            city={city} 
            setCity={setCity} 
            store={store} 
            setStore={setStore} 
            role={role} 
            setRole={setRole} 
            onBackHome={handleBackToHome} 
            onOpenConfig={handleOpenConfig} 
            onOpenReport={handleOpenReport}
            currentScreen={steps[activeStep]?.short}
          />
          <div className="grid grid-cols-1 gap-0 xl:grid-cols-[400px_minmax(0,1fr)]">
            <aside className="border-b border-slate-200/80 p-6 xl:border-b-0 xl:border-r">
              <div className="space-y-3">
                {steps.map((step, idx) => (
                  <TimelineStep key={step.id} step={step} active={activeStep === step.id - 1} done={activeStep > step.id - 1} onClick={() => setActiveStep(step.id - 1)} />
                ))}
              </div>
            </aside>
            <main className="p-6 lg:p-8">
              {activeStep === 0 && (
                <div>
                  <SectionTitle icon={Users} title="风险识别" desc="自动识别即将降级的高价值会员，并分析原因。" action={<Pill tone="blue">AI 完成</Pill>} />
                  <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-[1fr_1fr]">
                    <HumanAICard title="AI 输出洞察" items={steps[0].detail.insight} tone="ai" />
                    <HumanAICard title="问题诊断" items={steps[0].detail.diagnosis} tone="human" />
                  </div>
                  {role === "门店顾问" && (
                    <div className="mt-6 rounded-3xl border border-slate-200 bg-slate-50 p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <Info className="h-5 w-5 text-blue-500" />
                        <div className="font-semibold text-slate-900">顾问视角</div>
                      </div>
                      <div className="text-sm text-slate-600">
                        作为门店顾问，您将负责后续的会员跟进工作。系统已自动识别出需要重点关注的会员，请在后续步骤中查看您需要跟进的具体会员名单。
                      </div>
                    </div>
                  )}
                </div>
              )}
              {activeStep === 1 && (
                <div>
                  <SectionTitle icon={Sparkles} title="策略生成" desc="AI 自动生成多套方案并预估效果。" action={<Pill tone="purple">AI 完成</Pill>} />
                  <div className="mt-6 space-y-4">
                    {steps[1].plans.map((plan, idx) => (
                      <motion.div 
                        key={plan.name} 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className={cn("rounded-3xl border p-6", plan.recommended ? "border-slate-300 bg-slate-50" : "border-slate-200 bg-white")}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <div className="font-semibold text-slate-900">{plan.name}</div>
                            <div className="mt-2 text-sm text-slate-600">{plan.desc}</div>
                          </div>
                          {plan.recommended && <Pill tone="gold">推荐方案</Pill>}
                        </div>
                        <div className="mt-4 grid grid-cols-3 gap-3 text-sm">
                          {Object.entries(plan.metrics).map(([k, v]) => (
                            <div key={k} className="rounded-2xl border border-slate-200 bg-white px-3 py-2">{k}：{v}</div>
                          ))}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                  {role === "门店顾问" && (
                    <div className="mt-6 rounded-3xl border border-slate-200 bg-slate-50 p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <Info className="h-5 w-5 text-blue-500" />
                        <div className="font-semibold text-slate-900">执行说明</div>
                      </div>
                      <div className="text-sm text-slate-600">
                        系统已生成最优策略方案，您将负责方案的落地执行，包括会员联系、预约确认和到店接待等工作。
                      </div>
                    </div>
                  )}
                </div>
              )}
              {activeStep === 2 && (
                <div>
                  <SectionTitle icon={ShieldCheck} title="经营审批" desc="运营经理审核并确认执行方案。" action={<Pill tone="amber">人工审批</Pill>} />
                  <div className="mt-6 space-y-4">
                    <HumanAICard title="审批要点" items={steps[2].review} tone="human" />
                    {role === "总部运营经理" && (
                      <motion.button 
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setShowApproval(true)}
                        className="inline-flex items-center gap-2 rounded-2xl px-5 py-3 text-sm font-semibold text-white shadow-lg hover:-translate-y-0.5" 
                        style={{ backgroundColor: BRAND.primary, boxShadow: `0 12px 24px rgba(14,42,71,0.22)` }}
                      >
                        <ClipboardCheck className="h-4 w-4" />打开审批弹窗
                      </motion.button>
                    )}
                    {(role === "城市运营" || role === "门店顾问") && (
                      <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
                        <div className="flex items-center gap-3 mb-4">
                          <AlertTriangle className="h-5 w-5 text-amber-500" />
                          <div className="font-semibold text-slate-900">审批权限</div>
                        </div>
                        <div className="text-sm text-slate-600">
                          {role === "城市运营" ? "城市运营无审批权限，审批由总部运营经理负责。您可以查看审批结果并执行区域内的营销动作。" : "门店顾问无审批权限，审批由运营经理负责。您可以查看审批结果并执行后续的会员跟进任务。"}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
              {activeStep === 3 && (
                <div>
                  <SectionTitle icon={Bell} title="首轮执行" desc="自动触达与权益发放。" action={<Pill tone="green">AI 执行</Pill>} />
                  <div className="mt-6"><ChannelBoard stepId={4} /></div>
                  <div className="mt-6 flex flex-wrap gap-3">
                    {(role === "总部运营经理" || role === "城市运营") && (
                      <motion.button 
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setShowSend(true)}
                        className="inline-flex items-center gap-2 rounded-2xl px-5 py-3 text-sm font-semibold text-white shadow-lg hover:-translate-y-0.5" 
                        style={{ backgroundColor: BRAND.primary, boxShadow: `0 12px 24px rgba(14,42,71,0.22)` }}
                      >
                        <Send className="h-4 w-4" />模拟首轮触达发送
                      </motion.button>
                    )}
                  </div>
                  {role === "门店顾问" && (
                    <div className="mt-6 rounded-3xl border border-slate-200 bg-slate-50 p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <Info className="h-5 w-5 text-blue-500" />
                        <div className="font-semibold text-slate-900">执行准备</div>
                      </div>
                      <div className="text-sm text-slate-600">
                        系统正在执行首轮触达，您需要准备好后续的会员跟进工作。请关注系统推送的需要您跟进的会员名单。
                      </div>
                    </div>
                  )}
                </div>
              )}
              {activeStep === 4 && (
                <div>
                  <SectionTitle icon={Zap} title="响应分析" desc="追踪会员行为并进行分层。" action={<Pill tone="blue">AI 分析</Pill>} />
                  <div className="mt-6 space-y-4">
                    <HumanAICard title="行为分层与策略" items={steps[4].segment} tone="ai" />
                    <ChannelBoard stepId={5} />
                    <div className="mt-6">
                      <h4 className="text-lg font-semibold text-slate-900 mb-4">会员列表</h4>
                      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                        <div className="space-y-3">
                          {(role === "门店顾问" ? members.filter(m => m.advisor.includes(role.replace('顾问', ''))) : members).map((member) => (
                            <motion.div 
                              key={member.id}
                              whileHover={{ scale: 1.01 }}
                              className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 hover:border-slate-300 hover:bg-white cursor-pointer"
                              onClick={() => {
                                setSelectedMember(member);
                                setShowMemberDrawer(true);
                              }}
                            >
                              <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full text-white" style={{ backgroundColor: BRAND.primary }}>
                                  {member.name.charAt(0)}
                                </div>
                                <div>
                                  <div className="font-semibold text-slate-900">{member.name}</div>
                                  <div className="text-sm text-slate-600">{member.level} · {member.status}</div>
                                </div>
                              </div>
                              <div className="flex items-center gap-3">
                                <Pill tone={member.tag === "高风险" ? "rose" : member.tag === "待唤醒" ? "amber" : "blue"}>{member.tag}</Pill>
                                {role === "门店顾问" && (
                                  <button className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50">
                                    <Phone className="h-3.5 w-3.5" />
                                    联系
                                  </button>
                                )}
                                <ChevronRight className="h-4 w-4 text-slate-400" />
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {activeStep === 5 && (
                <div>
                  <SectionTitle icon={AlertTriangle} title="异常干预" desc="系统预警并由人工判断是否追加门店承接。" action={<Pill tone="rose">AI + 人工</Pill>} />
                  <div className="mt-6 space-y-4">
                    <div className="rounded-3xl border border-slate-200 bg-white p-6">
                      <div className="flex items-center justify-between gap-3">
                        <div className="font-semibold text-slate-900">异常预警</div>
                        <Pill tone="rose">已触发</Pill>
                      </div>
                      <div className="mt-4 space-y-3 text-sm text-slate-600">
                        <div>打开率：{steps[5].anomaly.openRate}</div>
                        <div>兑换率：{steps[5].anomaly.redeemRate}</div>
                        <div>异常比例：{steps[5].anomaly.abnormalRatio}</div>
                      </div>
                      <div className="mt-4 space-y-2 text-sm text-slate-700">
                        <div>异常原因：</div>
                        {steps[5].anomaly.reasons.map((r, idx) => (
                          <motion.div 
                            key={r} 
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="flex gap-2 items-start"
                          >
                            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" style={{ color: BRAND.primary }} />
                            {r}
                          </motion.div>
                        ))}
                      </div>
                      <div className="mt-4 flex items-center gap-2 text-sm font-semibold text-slate-900">
                        <div>决策：{steps[5].anomaly.decision}</div>
                      </div>
                    </div>
                    {role === "门店顾问" && (
                      <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
                        <div className="flex items-center gap-3 mb-4">
                          <Info className="h-5 w-5 text-blue-500" />
                          <div className="font-semibold text-slate-900">跟进任务</div>
                        </div>
                        <div className="text-sm text-slate-600">
                          系统已触发异常预警，需要您对重点客户进行一对一跟进。请查看后续步骤中的会员名单，及时联系未响应的高价值会员。
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
              {activeStep === 6 && (
                <div>
                  <SectionTitle icon={UserCheck} title="补触达与门店承接" desc="二次触达闭环。" action={<Pill tone="green">AI + 人工</Pill>} />
                  <div className="mt-6 space-y-4">
                    <HumanAICard title="补触达与门店动作" items={steps[6].loop} tone="human" />
                    <ChannelBoard stepId={7} />
                    <div className="mt-6 flex flex-wrap gap-3">
                      {(role === "总部运营经理" || role === "城市运营") && (
                        <motion.button 
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setShowReSend(true)}
                          className="inline-flex items-center gap-2 rounded-2xl px-5 py-3 text-sm font-semibold text-white shadow-lg hover:-translate-y-0.5" 
                          style={{ backgroundColor: BRAND.primary, boxShadow: `0 12px 24px rgba(14,42,71,0.22)` }}
                        >
                          <Send className="h-4 w-4" />模拟补触达发送
                        </motion.button>
                      )}
                      {role === "门店顾问" && (
                        <div className="mt-6 rounded-3xl border border-slate-200 bg-slate-50 p-6">
                          <div className="flex items-center gap-3 mb-4">
                            <Info className="h-5 w-5 text-blue-500" />
                            <div className="font-semibold text-slate-900">门店承接</div>
                          </div>
                          <div className="text-sm text-slate-600">
                            系统正在执行补触达，您需要做好门店承接工作，及时联系重点客户并确认到店时间。请查看会员列表中的待跟进会员。
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
              {activeStep === 7 && (
                <div>
                  <SectionTitle icon={LineChart} title="复盘沉淀" desc="输出保级率、积分消耗率、回厂率与核销率。" action={<Pill tone="brand">AI + 人工</Pill>} />
                  <div className="mt-6"><KpiBoard metrics={metrics} /></div>
                  <div className="mt-6 flex flex-wrap gap-3">
                    {(role === "总部运营经理" || role === "城市运营") && (
                      <motion.button 
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleOpenReport}
                        className="inline-flex items-center gap-2 rounded-2xl px-5 py-3 text-sm font-semibold text-white shadow-lg hover:-translate-y-0.5" 
                        style={{ backgroundColor: BRAND.primary, boxShadow: `0 12px 24px rgba(14,42,71,0.22)` }}
                      >
                        <Download className="h-4 w-4" />查看复盘报告与 SOP 模板
                      </motion.button>
                    )}
                  </div>
                  {role === "门店顾问" && (
                    <div className="mt-6 rounded-3xl border border-slate-200 bg-slate-50 p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <Info className="h-5 w-5 text-blue-500" />
                        <div className="font-semibold text-slate-900">复盘参与</div>
                      </div>
                      <div className="text-sm text-slate-600">
                        感谢您在本次活动中的门店承接工作。系统已完成复盘分析，您的跟进数据已纳入整体评估。请查看您的个人工作台了解具体的工作成果。
                      </div>
                    </div>
                  )}
                </div>
              )}
            </main>
          </div>
        </div>
      </div>
      <ApprovalModal open={showApproval} onClose={() => setShowApproval(false)} onApprove={handleApprove} />
      <SendDrawer open={showSend} onClose={() => setShowSend(false)} activeIndex={sendIndex} mode="首轮" />
      <SendDrawer open={showReSend} onClose={() => setShowReSend(false)} activeIndex={sendIndex} mode="补" />
      <MemberDrawer open={showMemberDrawer} onClose={() => setShowMemberDrawer(false)} member={selectedMember} />
      <GuidedTour open={showGuidedTour} onClose={() => setShowGuidedTour(false)} steps={tourSteps} currentStep={currentTourStep} />
    </Shell>
  );
}

export default App;