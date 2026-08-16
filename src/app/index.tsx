import { Fragment, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import {
  ActivityIndicator,
  Animated,
  Easing,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Circle, Defs, G, Line, LinearGradient, Polyline, Rect, Stop, Text as SvgText } from 'react-native-svg';

/* ─── Data type ─── */
type CancerData = {
  metadata: { source: string; incidence_source: string; projection_source: string; geography: string; current_year: number; projection_end_year: number };
  summary: { total_new_cases: number; total_cancer_related_deaths: number };
  gender: { male_cases: number; female_cases: number; male_percentage: number; female_percentage: number };
  top_cancers: { rank: number; cancer_type: string; total_cases: number }[];
  mortality: { total_deaths: number; asr_world_per_100k: number; crude_rate_per_100k: number; cumulative_risk_0_74_percent: number; note: string };
  projection: { year: number; projected_cases: number }[];
  calculations: { absolute_increase: number; percentage_growth: number; cagr_percent: number };
  observations: string[];
};

/* ─── Design Tokens ─── */
const P = {
  bg: '#F1F5F9',
  cardBg: 'rgba(255, 255, 255, 0.90)',
  cardBorder: 'rgba(255, 255, 255, 0.95)',
  ink: '#0F172A',
  secondary: '#334155',
  muted: '#64748B',
  border: '#E2E8F0',
  teal: '#0D9488',
  tealDark: '#0F766E',
  tealLight: '#CCFBF1',
  pink: '#E11D48',
  pinkLight: '#FFE4E6',
  lavender: '#7C3AED',
  lavenderLight: '#EDE9FE',
  amber: '#D97706',
  amberLight: '#FEF3C7',
  grid: '#E2E8F0',
  shadow: '#94A3B8',
};

/* ─── Formatters ─── */
const fmt = (v: number) => new Intl.NumberFormat('en-IN').format(v);

/* ─── Responsive Layout Hook ─── */
const useLayout = () => {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 960;
  const isTablet = width >= 600 && width < 960;
  const isMobile = width < 600;

  // Maximum content width: up to 1200px on desktop web
  const maxW = Math.min(width * 0.94, 1200);
  const pad = isDesktop ? 32 : isTablet ? 24 : 16;

  // Chart width calculation for stacked vs side-by-side sections
  const cardPadTotal = 40; // 20px padding left + right
  const desktopHalfWidth = Math.floor((maxW - pad * 2 - 20) / 2) - cardPadTotal;
  const fullWidth = maxW - pad * 2 - cardPadTotal;

  const halfChartW = Math.max(280, desktopHalfWidth);
  const fullChartW = Math.max(280, fullWidth);

  return { width, isDesktop, isTablet, isMobile, maxW, pad, halfChartW, fullChartW };
};

/* ─── Glassmorphism Card Component ─── */
function GlassCard({
  children,
  style,
  accentColor,
}: {
  children: ReactNode;
  style?: any;
  accentColor?: string;
}) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Pressable
      onHoverIn={() => setIsHovered(true)}
      onHoverOut={() => setIsHovered(false)}
      style={({ pressed }) => [
        s.glassCard,
        style,
        accentColor ? { borderTopColor: accentColor } : null,
        isHovered && s.glassCardHovered,
        Platform.OS === 'web' && isHovered && { transform: [{ translateY: -3 }] },
        pressed && { transform: [{ scale: 0.99 }] },
        ...(Platform.OS === 'web' && isHovered
          ? [{ boxShadow: accentColor ? `0 12px 24px -4px ${accentColor}25` : '0 12px 24px -4px rgba(148,163,184,0.18)' }]
          : []),
      ]}>
      {/* Top subtle glass streak */}
      <View style={s.glassStreak} />
      {children}
    </Pressable>
  );
}

function SectionHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <View style={s.sectionHdr}>
      <Text style={s.sectionTitle}>{title}</Text>
      {subtitle ? <Text style={s.sectionSub}>{subtitle}</Text> : null}
    </View>
  );
}

/* ─── Interactive KPI Card ─── */
function KpiCard({
  label,
  value,
  detail,
  accent,
}: {
  label: string;
  value: string;
  detail: string;
  accent: string;
}) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Pressable
      onHoverIn={() => setIsHovered(true)}
      onHoverOut={() => setIsHovered(false)}
      style={({ pressed }) => [
        s.kpiCard,
        { borderLeftColor: accent },
        isHovered && { borderLeftWidth: 6, transform: [{ translateY: -3 }] },
        pressed && { transform: [{ scale: 0.98 }] },
        ...(Platform.OS === 'web' && isHovered
          ? [{ boxShadow: `0 8px 20px -2px ${accent}30` }]
          : []),
      ]}>
      <Text style={s.kpiLabel}>{label}</Text>
      <Text style={s.kpiValue}>{value}</Text>
      <Text style={s.kpiDetail}>{detail}</Text>
    </Pressable>
  );
}

/* ─── Interactive Top 5 Cancer Bar Chart ─── */
function TopCancerChart({ data, width }: { data: CancerData['top_cancers']; width: number }) {
  const [activeIdx, setActiveIdx] = useState<number | null>(null);
  const barColors = [P.pink, P.teal, P.teal, P.lavender, P.lavender];
  const max = Math.max(...data.map((d) => d.total_cases));
  const top5Total = useMemo(() => data.reduce((acc, curr) => acc + curr.total_cases, 0), [data]);

  const labelW = Math.min(130, width * 0.35);
  const valueW = 85;
  const barArea = Math.max(60, width - labelW - valueW - 16);
  const rowH = 36;
  const gap = 10;
  const chartH = data.length * (rowH + gap);

  const activeItem = activeIdx !== null ? data[activeIdx] : null;

  return (
    <View style={s.chartContainer}>
      {/* Interactive Tooltip Callout */}
      {activeItem ? (
        <View style={s.tooltipBadge}>
          <Text style={s.tooltipTitle}>{activeItem.cancer_type}</Text>
          <Text style={s.tooltipValue}>
            {fmt(activeItem.total_cases)} cases ({((activeItem.total_cases / top5Total) * 100).toFixed(1)}% of top 5)
          </Text>
        </View>
      ) : (
        <View style={s.tooltipHint}>
          <Text style={s.tooltipHintText}>Hover or tap a bar to inspect details</Text>
        </View>
      )}

      <Svg width={width} height={chartH} accessibilityLabel="Top five cancer types by new cases bar chart">
        {data.map((item, i) => {
          const y = i * (rowH + gap);
          const bw = Math.max(6, (item.total_cases / max) * barArea);
          const isSelected = activeIdx === i;
          const barColor = barColors[i];

          return (
            <G
              key={item.cancer_type}
              onPress={() => setActiveIdx(activeIdx === i ? null : i)}
              //@ts-ignore - Web pointer events
              onMouseEnter={() => setActiveIdx(i)}
              onMouseLeave={() => setActiveIdx(null)}>
              {/* Cancer name label */}
              <SvgText
                x={0}
                y={y + rowH / 2 + 4}
                fill={isSelected ? P.ink : P.secondary}
                fontSize={width < 380 ? '10' : '11'}
                fontWeight={isSelected ? '700' : '600'}>
                {item.cancer_type}
              </SvgText>

              {/* Background Track */}
              <Rect x={labelW} y={y + 4} width={barArea} height={rowH - 8} rx={6} fill={P.bg} />

              {/* Active Bar */}
              <Rect
                x={labelW}
                y={y + 4}
                width={bw}
                height={rowH - 8}
                rx={6}
                fill={barColor}
                opacity={isSelected ? 1 : 0.85}
              />

              {/* Value Text */}
              <SvgText
                x={labelW + barArea + 8}
                y={y + rowH / 2 + 4}
                fill={isSelected ? P.ink : P.muted}
                fontSize="11"
                fontWeight={isSelected ? '700' : '600'}>
                {fmt(item.total_cases)}
              </SvgText>
            </G>
          );
        })}
      </Svg>
    </View>
  );
}

/* ─── Interactive Gender Donut Chart ─── */
function DonutChart({ gender, width }: { gender: CancerData['gender']; width: number }) {
  const [activeGender, setActiveGender] = useState<'male' | 'female' | null>(null);
  const size = Math.min(width, 240);
  const cx = size / 2;
  const cy = size / 2;
  const r = size * 0.36;
  const sw = size * 0.14;
  const circ = 2 * Math.PI * r;
  const maleArc = circ * (gender.male_percentage / 100);
  const totalCases = gender.male_cases + gender.female_cases;

  return (
    <View style={s.donutWrap}>
      <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} accessibilityLabel="Male and female cancer cases donut chart">
        {/* Female ring segment */}
        <Circle
          cx={cx}
          cy={cy}
          r={r}
          stroke={activeGender === 'female' ? '#F43F5E' : P.pinkLight}
          strokeWidth={activeGender === 'female' ? sw + 4 : sw}
          fill="none"
          onPress={() => setActiveGender(activeGender === 'female' ? null : 'female')}
          //@ts-ignore
          onMouseEnter={() => setActiveGender('female')}
          onMouseLeave={() => setActiveGender(null)}
        />

        {/* Male arc segment */}
        <Circle
          cx={cx}
          cy={cy}
          r={r}
          stroke={activeGender === 'male' ? P.tealDark : P.teal}
          strokeWidth={activeGender === 'male' ? sw + 4 : sw}
          fill="none"
          strokeDasharray={`${maleArc} ${circ - maleArc}`}
          strokeLinecap="butt"
          rotation="-90"
          origin={`${cx}, ${cy}`}
          onPress={() => setActiveGender(activeGender === 'male' ? null : 'male')}
          //@ts-ignore
          onMouseEnter={() => setActiveGender('male')}
          onMouseLeave={() => setActiveGender(null)}
        />

        {/* Inner core circle */}
        <Circle cx={cx} cy={cy} r={r - sw / 2 - 4} fill="#FFFFFF" />

        {/* Dynamic Center Text */}
        {activeGender === 'male' ? (
          <>
            <SvgText x={cx} y={cy - 6} textAnchor="middle" fill={P.tealDark} fontSize={size * 0.075} fontWeight="800">
              {fmt(gender.male_cases)}
            </SvgText>
            <SvgText x={cx} y={cy + size * 0.065} textAnchor="middle" fill={P.secondary} fontSize={size * 0.045} fontWeight="600">
              Male · {gender.male_percentage.toFixed(2)}%
            </SvgText>
          </>
        ) : activeGender === 'female' ? (
          <>
            <SvgText x={cx} y={cy - 6} textAnchor="middle" fill={P.pink} fontSize={size * 0.075} fontWeight="800">
              {fmt(gender.female_cases)}
            </SvgText>
            <SvgText x={cx} y={cy + size * 0.065} textAnchor="middle" fill={P.secondary} fontSize={size * 0.045} fontWeight="600">
              Female · {gender.female_percentage.toFixed(2)}%
            </SvgText>
          </>
        ) : (
          <>
            <SvgText x={cx} y={cy - 4} textAnchor="middle" fill={P.ink} fontSize={size * 0.072} fontWeight="800">
              {fmt(totalCases)}
            </SvgText>
            <SvgText x={cx} y={cy + size * 0.065} textAnchor="middle" fill={P.muted} fontSize={size * 0.045}>
              new cases
            </SvgText>
          </>
        )}
      </Svg>

      {/* Interactive Legend Rows */}
      <View style={s.legendContainer}>
        <Pressable
          onPress={() => setActiveGender(activeGender === 'male' ? null : 'male')}
          onHoverIn={() => setActiveGender('male')}
          onHoverOut={() => setActiveGender(null)}
          style={[s.legendRow, activeGender === 'male' && s.legendRowActive]}>
          <View style={[s.legendDot, { backgroundColor: P.teal }]} />
          <Text style={[s.legendTxt, activeGender === 'male' && s.legendTxtActive]}>
            Male · {fmt(gender.male_cases)} · {gender.male_percentage.toFixed(2)}%
          </Text>
        </Pressable>

        <Pressable
          onPress={() => setActiveGender(activeGender === 'female' ? null : 'female')}
          onHoverIn={() => setActiveGender('female')}
          onHoverOut={() => setActiveGender(null)}
          style={[s.legendRow, activeGender === 'female' && s.legendRowActive]}>
          <View style={[s.legendDot, { backgroundColor: P.pink }]} />
          <Text style={[s.legendTxt, activeGender === 'female' && s.legendTxtActive]}>
            Female · {fmt(gender.female_cases)} · {gender.female_percentage.toFixed(2)}%
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

/* ─── Interactive Projection Line Chart ─── */
function ProjectionChart({ data, width }: { data: CancerData['projection']; width: number }) {
  const [activeIdx, setActiveIdx] = useState<number | null>(null);
  const h = 210;
  const pad = { top: 30, right: 20, bottom: 36, left: 20 };
  const max = Math.max(...data.map((d) => d.projected_cases));
  const min = Math.min(...data.map((d) => d.projected_cases));
  const range = max - min || 1;

  const pts = data.map((d, i) => {
    const x = pad.left + (i / (data.length - 1)) * (width - pad.left - pad.right);
    const y = pad.top + (1 - (d.projected_cases - min) / range) * (h - pad.top - pad.bottom);
    return { ...d, x, y };
  });

  const polyline = pts.map((p) => `${p.x},${p.y}`).join(' ');
  const activePt = activeIdx !== null ? pts[activeIdx] : null;

  return (
    <View style={s.chartContainer}>
      {/* Interactive Tooltip Callout */}
      {activePt ? (
        <View style={s.tooltipBadge}>
          <Text style={s.tooltipTitle}>Year {activePt.year}</Text>
          <Text style={s.tooltipValue}>Projected cases: {fmt(activePt.projected_cases)}</Text>
        </View>
      ) : (
        <View style={s.tooltipHint}>
          <Text style={s.tooltipHintText}>Hover or tap data points to inspect projection values</Text>
        </View>
      )}

      <Svg width={width} height={h} accessibilityLabel="Cancer projection line chart from 2024 to 2050">
        <Defs>
          <LinearGradient id="projGrad" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor={P.teal} stopOpacity="0.18" />
            <Stop offset="1" stopColor={P.teal} stopOpacity="0.02" />
          </LinearGradient>
        </Defs>

        {/* Grid lines */}
        <Line x1={pad.left} x2={width - pad.right} y1={h - pad.bottom} y2={h - pad.bottom} stroke={P.grid} />
        <Line x1={pad.left} x2={width - pad.right} y1={pad.top} y2={pad.top} stroke={P.grid} strokeDasharray="4 4" />
        <Line
          x1={pad.left}
          x2={width - pad.right}
          y1={(h - pad.bottom + pad.top) / 2}
          y2={(h - pad.bottom + pad.top) / 2}
          stroke={P.grid}
          strokeDasharray="4 4"
        />

        {/* Area fill */}
        <Rect
          x={pts[0].x}
          y={pad.top}
          width={pts[pts.length - 1].x - pts[0].x}
          height={h - pad.top - pad.bottom}
          fill="url(#projGrad)"
        />

        {/* Main Line */}
        <Polyline points={polyline} fill="none" stroke={P.teal} strokeWidth={3} strokeLinejoin="round" />

        {/* Points */}
        {pts.map((p, i) => {
          const isSelected = activeIdx === i;
          return (
            <G
              key={p.year}
              onPress={() => setActiveIdx(activeIdx === i ? null : i)}
              //@ts-ignore
              onMouseEnter={() => setActiveIdx(i)}
              onMouseLeave={() => setActiveIdx(null)}>
              {/* Outer touch highlight ring */}
              <Circle
                cx={p.x}
                cy={p.y}
                r={isSelected ? 12 : 8}
                fill={P.teal}
                opacity={isSelected ? 0.25 : 0}
              />
              {/* Main dot */}
              <Circle
                cx={p.x}
                cy={p.y}
                r={isSelected ? 6.5 : i === 0 ? 5 : 4}
                fill={isSelected ? P.pink : i === 0 ? P.pink : P.teal}
                stroke="#FFFFFF"
                strokeWidth={2}
              />
              {/* Year Label */}
              <SvgText
                x={p.x}
                y={h - 10}
                textAnchor="middle"
                fill={isSelected ? P.ink : P.muted}
                fontSize="10"
                fontWeight={isSelected ? '700' : '500'}>
                {p.year}
              </SvgText>
            </G>
          );
        })}
      </Svg>
    </View>
  );
}

/* ─── Main Screen ─── */
export default function HomeScreen() {
  const layout = useLayout();
  const [data, setData] = useState<CancerData | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Entrance Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    try {
      const loaded = require('@/assets/data/cancer_india.json') as CancerData;
      setData(loaded);

      // Trigger smooth entrance animation
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 500,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
      ]).start();
    } catch {
      setError('The local processed cancer data could not be loaded. Run npm run sync:data and restart the app.');
    }
  }, []);

  const observations = useMemo(() => data?.observations.slice(0, 3) ?? [], [data]);

  if (error) {
    return (
      <SafeAreaView style={s.center}>
        <Text style={s.errTitle}>Data unavailable</Text>
        <Text style={s.errText}>{error}</Text>
      </SafeAreaView>
    );
  }

  if (!data) {
    return (
      <SafeAreaView style={s.center}>
        <ActivityIndicator size="large" color={P.teal} />
        <Text style={s.loadTxt}>Loading local India cancer data…</Text>
      </SafeAreaView>
    );
  }

  const { metadata, summary, gender, mortality, calculations } = data;
  const finalProj = data.projection[data.projection.length - 1];

  // Grid / Column Layout Decision
  const kpiCols = layout.isDesktop ? 3 : layout.isTablet ? 2 : 1;
  const isDesktopSideBySide = layout.isDesktop;

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <ScrollView
        style={s.scroll}
        contentContainerStyle={[
          s.content,
          { maxWidth: layout.maxW, alignSelf: 'center', width: '100%', paddingHorizontal: layout.pad },
        ]}
        showsVerticalScrollIndicator={false}>
        <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
          {/* ── Hero Header ── */}
          <View style={s.hero}>
            <Text style={s.eyebrow}>IARC GLOBAL CANCER OBSERVATORY · INDIA</Text>
            <Text style={s.title}>India Cancer Analytics</Text>
            <Text style={s.subtitle}>
              {metadata.current_year}–{metadata.projection_end_year} | India Cancer Burden & Projection
            </Text>
            <View style={s.pill}>
              <View style={s.pillDot} />
              <Text style={s.pillTxt}>Local data · offline ready</Text>
            </View>
          </View>

          {/* ── KPI Section ── */}
          <SectionHeader title="At a glance" subtitle="India's cancer burden and outlook" />
          <View style={[s.kpiGrid, kpiCols === 3 && s.kpiGrid3, kpiCols === 2 && s.kpiGrid2]}>
            <KpiCard label="New cancer cases" value={fmt(summary.total_new_cases)} detail={`${metadata.current_year}`} accent={P.teal} />
            <KpiCard label="Cancer-related deaths" value={fmt(summary.total_cancer_related_deaths)} detail={`${metadata.current_year}`} accent={P.pink} />
            <KpiCard label="Projected cases" value={fmt(finalProj.projected_cases)} detail={`${metadata.projection_end_year}`} accent={P.lavender} />
            <KpiCard label="Absolute increase" value={fmt(calculations.absolute_increase)} detail={`${fmt(calculations.absolute_increase)} cases`} accent={P.amber} />
            <KpiCard label="Percentage growth" value={`${calculations.percentage_growth.toFixed(2)}%`} detail={`${metadata.current_year}–${metadata.projection_end_year}`} accent={P.teal} />
            <KpiCard label="CAGR" value={`${calculations.cagr_percent.toFixed(2)}%`} detail="Average annual growth" accent={P.teal} />
          </View>

          {/* ── Row 1: Top 5 Cancers & Gender Split (2-Column on Desktop) ── */}
          <View style={isDesktopSideBySide ? s.desktopRow : s.stackedRow}>
            <GlassCard style={isDesktopSideBySide ? s.flex1 : s.fullWidth}>
              <SectionHeader title="Top 5 cancer types" subtitle={`New cases · ${metadata.current_year}`} />
              <TopCancerChart data={data.top_cancers} width={isDesktopSideBySide ? layout.halfChartW : layout.fullChartW} />
            </GlassCard>

            <GlassCard style={isDesktopSideBySide ? s.flex1 : s.fullWidth}>
              <SectionHeader title="Male vs female" subtitle={`New cancer cases · ${metadata.current_year}`} />
              <DonutChart gender={gender} width={isDesktopSideBySide ? layout.halfChartW : layout.fullChartW} />
            </GlassCard>
          </View>

          {/* ── Row 2: Cancer Case Projection ── */}
          <GlassCard style={s.fullWidth}>
            <SectionHeader title="Cancer case projection" subtitle={`Reported projection periods · ${metadata.current_year}–${metadata.projection_end_year}`} />
            <ProjectionChart data={data.projection} width={layout.fullChartW} />
            <View style={s.chartLegend}>
              <View style={[s.legendDot, { backgroundColor: P.pink }]} />
              <Text style={s.legendTxt}>Base year ({metadata.current_year})</Text>
              <View style={[s.legendDot, { backgroundColor: P.teal, marginLeft: 16 }]} />
              <Text style={s.legendTxt}>Projected values ({metadata.projection_end_year})</Text>
            </View>
          </GlassCard>

          {/* ── Row 3: Overall Mortality & Key Observations (2-Column on Desktop) ── */}
          <View style={isDesktopSideBySide ? s.desktopRow : s.stackedRow}>
            <GlassCard style={isDesktopSideBySide ? s.flex1 : s.fullWidth}>
              <SectionHeader title="Overall mortality" subtitle={`India · ${metadata.current_year} · not cancer-type specific`} />
              <View style={s.mortMain}>
                <Text style={s.mortNum}>{fmt(mortality.total_deaths)}</Text>
                <Text style={s.mortLabel}>total cancer-related deaths</Text>
              </View>
              <View style={s.mortGrid}>
                <View style={s.mortItem}>
                  <Text style={s.metricVal}>{mortality.asr_world_per_100k}</Text>
                  <Text style={s.metricLbl}>ASR (World) / 100k</Text>
                </View>
                <View style={s.mortItem}>
                  <Text style={s.metricVal}>{mortality.crude_rate_per_100k}</Text>
                  <Text style={s.metricLbl}>Crude rate / 100k</Text>
                </View>
                <View style={s.mortItem}>
                  <Text style={s.metricVal}>{mortality.cumulative_risk_0_74_percent}%</Text>
                  <Text style={s.metricLbl}>Cumulative risk · 0–74</Text>
                </View>
              </View>
              <Text style={s.note}>{mortality.note}</Text>
            </GlassCard>

            <GlassCard style={isDesktopSideBySide ? s.flex1 : s.fullWidth}>
              <SectionHeader title="Key observations" subtitle="From the local processed dataset" />
              {observations.map((obs, i) => (
                <View key={obs} style={s.obs}>
                  <View style={s.obsIdx}>
                    <Text style={s.obsIdxTxt}>{String(i + 1).padStart(2, '0')}</Text>
                  </View>
                  <Text style={s.obsTxt}>{obs}</Text>
                </View>
              ))}
            </GlassCard>
          </View>

          {/* ── Source Card ── */}
          <GlassCard style={s.sourceCard}>
            <Text style={s.sourceTitle}>{metadata.source}</Text>
            <Text style={s.sourceTxt}>Incidence: {metadata.incidence_source}</Text>
            <Text style={s.sourceTxt}>Projection: {metadata.projection_source}</Text>
            <Text style={s.sourceNote}>
              All dashboard data is stored locally and the application does not require an internet connection.
            </Text>
          </GlassCard>

          <View style={{ height: 32 }} />
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

/* ─── Styles ─── */
const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: P.bg },
  scroll: { flex: 1 },
  content: { paddingTop: 16, paddingBottom: 40, gap: 18 },
  center: { flex: 1, backgroundColor: P.bg, alignItems: 'center', justifyContent: 'center', padding: 28 },

  /* Header */
  hero: { paddingTop: 12, paddingBottom: 6, marginBottom: 4 },
  eyebrow: { color: P.tealDark, fontSize: 11, fontWeight: '800', letterSpacing: 1.8, textTransform: 'uppercase' },
  title: { color: P.ink, fontSize: 32, fontWeight: '800', letterSpacing: -0.8, marginTop: 6 },
  subtitle: { color: P.secondary, fontSize: 14, lineHeight: 22, marginTop: 4 },
  pill: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E6F4F0',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginTop: 12,
    gap: 7,
  },
  pillDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: '#0D9488' },
  pillTxt: { color: '#0F766E', fontSize: 11, fontWeight: '700' },

  /* Section Header */
  sectionHdr: { marginBottom: 12 },
  sectionTitle: { color: P.ink, fontSize: 19, fontWeight: '800', letterSpacing: -0.3 },
  sectionSub: { color: P.muted, fontSize: 12, marginTop: 3 },

  /* Glass Card */
  glassCard: {
    backgroundColor: P.cardBg,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: P.cardBorder,
    padding: 20,
    position: 'relative',
    overflow: 'hidden',
    ...Platform.select({
      ios: { shadowColor: P.shadow, shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.08, shadowRadius: 16 },
      android: { elevation: 3 },
      default: {},
    }),
    ...(Platform.OS === 'web'
      ? {
          boxShadow: '0 6px 20px -2px rgba(148,163,184,0.12)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
        }
      : {}),
  } as any,
  glassCardHovered: {
    borderColor: '#CBD5E1',
  },
  glassStreak: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },

  /* Multi-column row layout */
  desktopRow: { flexDirection: 'row', gap: 18, alignItems: 'stretch' },
  stackedRow: { flexDirection: 'column', gap: 18 },
  flex1: { flex: 1 },
  fullWidth: { width: '100%' },

  /* KPI Grid */
  kpiGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  kpiGrid3: {},
  kpiGrid2: {},
  kpiCard: {
    backgroundColor: P.cardBg,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: P.cardBorder,
    borderLeftWidth: 5,
    padding: 16,
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: '30%',
    minWidth: 160,
    ...Platform.select({
      ios: { shadowColor: P.shadow, shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.06, shadowRadius: 8 },
      android: { elevation: 2 },
      default: {},
    }),
    ...(Platform.OS === 'web'
      ? {
          boxShadow: '0 4px 14px -2px rgba(148,163,184,0.08)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
        }
      : {}),
  } as any,
  kpiLabel: { color: P.muted, fontSize: 11, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.4 },
  kpiValue: { color: P.ink, fontSize: 24, fontWeight: '800', letterSpacing: -0.6, marginTop: 8 },
  kpiDetail: { color: P.secondary, fontSize: 11, marginTop: 4, fontWeight: '500' },

  /* Chart Container & Tooltips */
  chartContainer: { position: 'relative' },
  tooltipBadge: {
    backgroundColor: P.ink,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginBottom: 10,
    alignSelf: 'flex-start',
  },
  tooltipTitle: { color: '#FFFFFF', fontSize: 12, fontWeight: '700' },
  tooltipValue: { color: '#CBD5E1', fontSize: 11, marginTop: 1 },
  tooltipHint: { marginBottom: 10 },
  tooltipHintText: { color: P.muted, fontSize: 11, fontStyle: 'italic' },

  /* Donut */
  donutWrap: { alignItems: 'center', paddingVertical: 6 },
  legendContainer: { marginTop: 12, gap: 6, width: '100%', alignItems: 'center' },
  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  legendRowActive: { backgroundColor: P.bg },
  legendDot: { width: 10, height: 10, borderRadius: 5, marginRight: 8 },
  legendTxt: { color: P.secondary, fontSize: 12, fontWeight: '500' },
  legendTxtActive: { color: P.ink, fontWeight: '700' },

  /* Chart Legend */
  chartLegend: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 10 },

  /* Mortality */
  mortMain: {
    alignItems: 'center',
    backgroundColor: P.pinkLight,
    borderRadius: 14,
    paddingVertical: 18,
    paddingHorizontal: 14,
    marginBottom: 16,
  },
  mortNum: { color: P.ink, fontSize: 28, fontWeight: '800' },
  mortLabel: { color: P.secondary, fontSize: 12, marginTop: 3, fontWeight: '500' },
  mortGrid: { flexDirection: 'row', justifyContent: 'space-between', gap: 8 },
  mortItem: { flex: 1, alignItems: 'center' },
  metricVal: { color: P.ink, fontSize: 18, fontWeight: '800' },
  metricLbl: { color: P.muted, fontSize: 10, marginTop: 4, textAlign: 'center', lineHeight: 14, fontWeight: '500' },
  note: { color: P.muted, fontSize: 11, fontStyle: 'italic', lineHeight: 16, marginTop: 16 },

  /* Observations */
  obs: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 14, gap: 10 },
  obsIdx: { backgroundColor: P.tealLight, borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3, marginTop: 1 },
  obsIdxTxt: { color: P.tealDark, fontSize: 11, fontWeight: '800' },
  obsTxt: { color: P.secondary, fontSize: 13, lineHeight: 21, flex: 1 },

  /* Source */
  sourceCard: { backgroundColor: '#F8FAFC' },
  sourceTitle: { color: P.ink, fontSize: 14, fontWeight: '800', marginBottom: 6 },
  sourceTxt: { color: P.secondary, fontSize: 12, lineHeight: 18 },
  sourceNote: { color: P.tealDark, fontSize: 11, fontWeight: '700', lineHeight: 16, marginTop: 12 },

  /* Loading/Error */
  loadTxt: { color: P.muted, marginTop: 14, fontSize: 13 },
  errTitle: { color: P.ink, fontSize: 20, fontWeight: '800' },
  errText: { color: P.secondary, lineHeight: 20, marginTop: 8, textAlign: 'center' },
});