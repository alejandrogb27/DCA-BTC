import { useState, useEffect, useMemo } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

const BTC_COLOR = "#F7931A";
const ARS_COLOR = "#86efac";
const BG = "#0f0f14";
const CARD = "#18181f";
const BORDER = "#2a2a36";
const TEXT = "#e8e6f0";
const MUTED = "#7a7890";
const BLUE = "#60a5fa";
const GREEN = "#4ade80";
const RED = "#f87171";

const formatARS = (v) => `$${v.toLocaleString("es-AR", { maximumFractionDigits: 0 })}`;
const formatBTC = (v) => v.toFixed(8);
const formatSats = (v) => v.toLocaleString("es-AR", { maximumFractionDigits: 0 });

// ---------------------------------------------------------------------------
// Datos base por mes. Para agregar un mes nuevo: crear el array acá y sumar
// una entrada en MESES (abajo) — el resto de la app (persistencia, merge,
// formulario, gráficos) funciona de forma genérica para cualquier mes de MESES.
// ---------------------------------------------------------------------------

const JUNIO_2026 = [
  { fecha: "1/6", dia: 1, ars: 921.56, btc: 0.00000848 },
  { fecha: "2/6", dia: 2, ars: 288.80, btc: 0.00000276 },
  { fecha: "3/6", dia: 3, ars: 1325.83, btc: 0.00001299 },
  { fecha: "4/6", dia: 4, ars: 1296.75, btc: 0.00001327 },
  { fecha: "5/6", dia: 5, ars: 1280.26, btc: 0.00001326 },
  { fecha: "7/6", dia: 7, ars: 74.44, btc: 0.00000074 },
  { fecha: "8/6", dia: 8, ars: 3061.47, btc: 0.00003153 },
  { fecha: "9/6", dia: 9, ars: 713.79, btc: 0.00000732 },
  { fecha: "10/6", dia: 10, ars: 652.60, btc: 0.00000695 },
  { fecha: "11/6", dia: 11, ars: 605.74, btc: 0.00000626 },
  { fecha: "12/6", dia: 12, ars: 600.94, btc: 0.00000619 },
  { fecha: "13/6", dia: 13, ars: 80.46, btc: 0.00000083 },
  { fecha: "14/6", dia: 14, ars: 80.46, btc: 0.00000081 },
  { fecha: "15/6", dia: 15, ars: 80.46, btc: 0.00000074 },
  { fecha: "16/6", dia: 16, ars: 2167, btc: 0.00002223 },
  { fecha: "17/6", dia: 17, ars: 530.11, btc: 0.00000535 },
  { fecha: "18/6", dia: 18, ars: 489.50, btc: 0.00000495 },
  { fecha: "19/6", dia: 19, ars: 482.24, btc: 0.00000500 },
  { fecha: "20/6", dia: 20, ars: 178.31, btc: 0.00000181 },
  { fecha: "21/6", dia: 21, ars: 184.44, btc: 0.00000186 },
  { fecha: "22/6", dia: 22, ars: 1237.01, btc: 0.00001246 },
  { fecha: "23/6", dia: 23, ars: 461.35, btc: 0.00000476 },
  { fecha: "24/6", dia: 24, ars: 454.39, btc: 0.00000461 },
  { fecha: "25/6", dia: 25, ars: 334.35, btc: 0.00000344 },
  { fecha: "26/6", dia: 26, ars: 320.54, btc: 0.00000340 },
  { fecha: "27/6", dia: 27, ars: 192.77, btc: 0.00000201 },
  { fecha: "28/6", dia: 28, ars: 192.77, btc: 0.00000203 },
  { fecha: "29/6", dia: 29, ars: 387.99, btc: 0.00000411 },
  { fecha: "30/6", dia: 30, ars: 282.99, btc: 0.00000300 },
];

const JULIO_2026 = [
  { fecha: "1/7", dia: 1, ars: 267.82, btc: 0.00000287 },
  { fecha: "2/7", dia: 2, ars: 266.06, btc: 0.00000277 },
  { fecha: "3/7", dia: 3, ars: 1229.15, btc: 0.00001247 },
  { fecha: "4/7", dia: 4, ars: 201.61, btc: 0.00000202 },
  { fecha: "5/7", dia: 5, ars: 200.76, btc: 0.00000201 },
  { fecha: "6/7", dia: 6, ars: 3123.11, btc: 0.00003111 },
  { fecha: "7/7", dia: 7, ars: 943.34, btc: 0.00000938 },
  { fecha: "8/7", dia: 8, ars: 938.49, btc: 0.00000934 },
  { fecha: "9/7", dia: 9, ars: 436.69, btc: 0.00000437 },
  { fecha: "10/7", dia: 10, ars: 436.69, btc: 0.00000425 },
  { fecha: "11/7", dia: 11, ars: 436.69, btc: 0.00000426 },
  { fecha: "12/7", dia: 12, ars: 436.69, btc: 0.00000428 },
  { fecha: "13/7", dia: 13, ars: 2458.33, btc: 0.00002449 },
  { fecha: "14/7", dia: 14, ars: 404.95, btc: 0.00000405 },
  { fecha: "15/7", dia: 15, ars: 388.41, btc: 0.00000379 },
  { fecha: "16/7", dia: 16, ars: 393.97, btc: 0.00000387 },
  { fecha: "17/7", dia: 17, ars: 433.79, btc: 0.00000433 },
  { fecha: "18/7", dia: 18, ars: 87.29, btc: 0.00000085 },
  { fecha: "19/7", dia: 19, ars: 87.29, btc: 0.00000084 },
  { fecha: "20/7", dia: 20, ars: 924.31, btc: 0.00000899 },
  { fecha: "21/7", dia: 21, ars: 313.60, btc: 0.00000295 },
  { fecha: "22/7", dia: 22, ars: 290.65, btc: 0.00000276 },
  { fecha: "23/7", dia: 23, ars: 289.27, btc: 0.00000276 },
  { fecha: "24/7", dia: 24, ars: 291.33, btc: 0.00000278 },
  { fecha: "25/7", dia: 25, ars: 93.46, btc: 0.00000089 },
  { fecha: "26/7", dia: 26, ars: 93.46, btc: 0.00000088 },
  { fecha: "27/7", dia: 27, ars: 689.83, btc: 0.00000653 },
  { fecha: "28/7", dia: 28, ars: 235.00, btc: 0.00000227 },
  { fecha: "29/7", dia: 29, ars: 220.13, btc: 0.00000210 },
  { fecha: "30/7", dia: 30, ars: 206.53, btc: 0.00000198 },
  { fecha: "31/7", dia: 31, ars: 187.12, btc: 0.00000183 },
];

const AGOSTO_2026 = [
  { fecha: "1/8", dia: 1, ars: 130.33, btc: 0.00000129 },
  { fecha: "2/8", dia: 2, ars: 130.33, btc: 0.00000128 },
  { fecha: "3/8", dia: 3, ars: 278.25, btc: 0.00000272 },
  { fecha: "4/8", dia: 4, ars: 1156.06, btc: 0.00001127 },
  { fecha: "5/8", dia: 5, ars: 1114.35, btc: 0.00001084 },
  { fecha: "6/8", dia: 6, ars: 1127.09, btc: 0.00001083 },
  { fecha: "7/8", dia: 7, ars: 957.06, btc: 0.00000925 },
  { fecha: "8/8", dia: 8, ars: 23.13, btc: 0.00000022 },
  { fecha: "9/8", dia: 9, ars: 96.10, btc: 0.00000091 },
  { fecha: "10/8", dia: 10, ars: 1511.82, btc: 0.00001443 },
  { fecha: "11/8", dia: 11, ars: 407.29, btc: 0.00000397 },
  { fecha: "12/8", dia: 12, ars: 406.61, btc: 0.00000394 },
  { fecha: "13/8", dia: 13, ars: 414.63, btc: 0.00000402 },
  { fecha: "14/8", dia: 14, ars: 426.97, btc: 0.00000422 },
  { fecha: "15/8", dia: 15, ars: 125.19, btc: 0.00000124 },
  { fecha: "16/8", dia: 16, ars: 125.19, btc: 0.00000123 },
  { fecha: "17/8", dia: 17, ars: 125.17, btc: 0.00000122 },
  { fecha: "18/8", dia: 18, ars: 1382.72, btc: 0.00001323 },
  { fecha: "19/8", dia: 19, ars: 422.13, btc: 0.00000380 },
  { fecha: "20/8", dia: 20, ars: 387.29, btc: 0.00000335 },
  { fecha: "21/8", dia: 21, ars: 373.29, btc: 0.00000298 },
  { fecha: "22/8", dia: 22, ars: 140.55, btc: 0.00000113 },
  { fecha: "23/8", dia: 23, ars: 140.55, btc: 0.00000111 },
  { fecha: "24/8", dia: 24, ars: 597.50, btc: 0.00000461 },
  { fecha: "25/8", dia: 25, ars: 314.75, btc: 0.00000244 },
  { fecha: "26/8", dia: 26, ars: 314.62, btc: 0.00000246 },
  { fecha: "27/8", dia: 27, ars: 294.62, btc: 0.00000226 },
  { fecha: "28/8", dia: 28, ars: 294.62, btc: 0.00000233 },
  { fecha: "29/8", dia: 29, ars: 155.61, btc: 0.00000122 },
  { fecha: "30/8", dia: 30, ars: 155.61, btc: 0.00000123 },
  { fecha: "31/8", dia: 31, ars: 835.90, btc: 0.00000652 },
];

const SEPTIEMBRE_2026 = [
  { fecha: "1/9", dia: 1, ars: 217.64, btc: 0.00000174 },
  { fecha: "2/9", dia: 2, ars: 214.14, btc: 0.00000171 },
  { fecha: "3/9", dia: 3, ars: 1484.69, btc: 0.00001177 },
  { fecha: "4/9", dia: 4, ars: 0, btc: 0 },
  { fecha: "5/9", dia: 5, ars: 1337.63, btc: 0.00001041 },
  { fecha: "6/9", dia: 6, ars: 0, btc: 0 },
  { fecha: "7/9", dia: 7, ars: 3193.12, btc: 0.00002504 },
  { fecha: "8/9", dia: 8, ars: 701.54, btc: 0.00000554 },
  { fecha: "9/9", dia: 9, ars: 487.78, btc: 0.00000385 },
  { fecha: "10/9", dia: 10, ars: 543.26, btc: 0.00000435 },
  { fecha: "11/9", dia: 11, ars: 484.49, btc: 0.00000387 },
  { fecha: "12/9", dia: 12, ars: 0, btc: 0 },
  { fecha: "13/9", dia: 13, ars: 39.91, btc: 0.00000031 },
];

// ---------------------------------------------------------------------------
// Registro de meses. "editable: true" habilita el formulario de carga manual
// y la persistencia en storage para ese mes. Agregar un mes nuevo = una línea
// acá + su array de datos arriba.
// ---------------------------------------------------------------------------
const MESES = [
  { id: "2026-06", label: "Junio 2026", base: JUNIO_2026, editable: false },
  { id: "2026-07", label: "Julio 2026", base: JULIO_2026, editable: true },
  { id: "2026-08", label: "Agosto 2026", base: AGOSTO_2026, editable: true },
  { id: "2026-09", label: "Septiembre 2026", base: SEPTIEMBRE_2026, editable: true },
];

const storageKey = (mesId) => `${mesId}_entries`;

function diasEnMes(mesId) {
  const [anio, mes] = mesId.split("-").map(Number);
  return new Date(anio, mes, 0).getDate(); // día 0 del mes siguiente = último día de este mes
}

function withCalcs(entries) {
  let acumArs = 0;
  let acumBtc = 0;
  return [...entries]
    .sort((a, b) => a.dia - b.dia)
    .map((e) => {
      acumArs += e.ars;
      acumBtc += e.btc;
      return { ...e, precio: e.btc ? e.ars / e.btc : null, arsAcum: acumArs, btcAcum: acumBtc, satsAcum: acumBtc * 100000000 };
    });
}

function totales(entries) {
  const n = entries.length || 1;
  const ta = entries.reduce((s, d) => s + d.ars, 0);
  const tb = entries.reduce((s, d) => s + d.btc, 0);
  return { n: entries.length, totalArs: ta, totalBtc: tb, avgArs: ta / n, avgBtc: tb / n };
}

// ---------------------------------------------------------------------------
// Helpers de estilo reutilizables (evitan repetir el mismo objeto style
// inline en cada botón/card del archivo).
// ---------------------------------------------------------------------------
const cardStyle = (extra) => ({ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 14, ...extra });

const pillButtonStyle = (active, accent = BTC_COLOR) => ({
  background: active ? "#2a2a36" : "transparent",
  color: active ? TEXT : MUTED,
  border: `1px solid ${active ? accent : BORDER}`,
  borderRadius: 8,
  padding: "7px 16px",
  fontSize: 13,
  fontWeight: 600,
  cursor: "pointer",
});

const statCardStyle = { background: CARD, border: `1px solid ${BORDER}`, borderRadius: 12, padding: "14px 14px" };
const statLabelStyle = { margin: "0 0 6px", color: MUTED, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.6px" };

// Tooltip genérico para los gráficos de línea. `formatter` recibe el valor
// crudo del punto y devuelve el string a mostrar.
function ChartTooltip({ active, payload, label, formatter, color }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 10, padding: "10px 16px", fontSize: 13 }}>
      <p style={{ color: MUTED, marginBottom: 4 }}>{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: color ?? p.color, margin: 0 }}>
          {formatter ? formatter(p) : p.value}
        </p>
      ))}
    </div>
  );
}

export default function App() {
  const [mesActivo, setMesActivo] = useState(MESES[0].id);
  const [tab, setTab] = useState("ars");
  // Un solo estado para todos los meses editables: { "2026-07": [...], "2026-08": [...], ... }
  const [entriesByMes, setEntriesByMes] = useState(() =>
    Object.fromEntries(MESES.filter((m) => m.editable).map((m) => [m.id, m.base]))
  );
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showTable, setShowTable] = useState(false);
  const [showMesesMenu, setShowMesesMenu] = useState(false);
  const [formDia, setFormDia] = useState("");
  const [formArs, setFormArs] = useState("");
  const [formBtc, setFormBtc] = useState("");
  const [saveError, setSaveError] = useState("");

  // Carga inicial: trae de storage lo guardado para cada mes editable y lo
  // mergea sobre la base hardcodeada (storage gana por día si hay conflicto).
  useEffect(() => {
    (async () => {
      try {
        const editables = MESES.filter((m) => m.editable);
        const resultados = await Promise.all(
          editables.map((m) => window.storage.get(storageKey(m.id)).catch(() => null))
        );
        setEntriesByMes((prev) => {
          const next = { ...prev };
          editables.forEach((m, i) => {
            const result = resultados[i];
            if (!result?.value) return;
            const stored = JSON.parse(result.value);
            const merged = [...m.base];
            stored.forEach((s) => {
              const idx = merged.findIndex((b) => b.dia === s.dia);
              if (idx >= 0) merged[idx] = s; else merged.push(s);
            });
            next[m.id] = merged;
          });
          return next;
        });
      } catch (e) {
        // no hay datos guardados todavía
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const persist = async (mesId, entries) => {
    setEntriesByMes((prev) => ({ ...prev, [mesId]: entries }));
    try {
      await window.storage.set(storageKey(mesId), JSON.stringify(entries));
    } catch (e) {
      console.error("No se pudo guardar", e);
    }
  };

  // Merge final por mes (base + lo cargado), memoizado para no recalcular en
  // cada render salvo que cambien las entries.
  const mergedByMes = useMemo(() => {
    const out = {};
    MESES.forEach((m) => {
      if (!m.editable) { out[m.id] = m.base; return; }
      const map = {};
      m.base.forEach((e) => { map[e.dia] = e; });
      (entriesByMes[m.id] ?? m.base).forEach((e) => { map[e.dia] = e; });
      out[m.id] = Object.values(map);
    });
    return out;
  }, [entriesByMes]);

  const datosPorMes = useMemo(() => {
    const out = {};
    MESES.forEach((m) => { out[m.id] = withCalcs(mergedByMes[m.id]); });
    return out;
  }, [mergedByMes]);

  const data = datosPorMes[mesActivo] ?? [];
  const tot = totales(data);
  const mesInfo = MESES.find((m) => m.id === mesActivo);
  const mesLabel = mesInfo?.label;

  const handleAddEntry = async () => {
    setSaveError("");
    const dia = parseInt(formDia, 10);
    const ars = parseFloat(formArs.replace(",", "."));
    const btc = parseFloat(formBtc.replace(",", "."));
    const maxDia = mesInfo ? diasEnMes(mesInfo.id) : 31;
    if (!dia || dia < 1 || dia > maxDia) { setSaveError(`Día inválido (1-${maxDia})`); return; }
    if (isNaN(ars) || ars < 0) { setSaveError("Monto ARS inválido"); return; }
    if (isNaN(btc) || btc < 0) { setSaveError("Monto BTC inválido"); return; }
    if (!mesInfo?.editable) return;

    const mesNumero = mesInfo.id.split("-")[1].replace(/^0/, "");
    const nuevaEntry = { fecha: `${dia}/${mesNumero}`, dia, ars, btc };
    const actuales = entriesByMes[mesInfo.id] ?? mesInfo.base;
    const sinDuplicado = actuales.filter((e) => e.dia !== dia);
    await persist(mesInfo.id, [...sinDuplicado, nuevaEntry]);

    setFormDia("");
    setFormArs("");
    setFormBtc("");
    setShowForm(false);
  };

  const tabs = [
    { id: "ars", label: "ARS invertidos" },
    { id: "btc", label: "BTC por día" },
    { id: "acum", label: "Acumulado (sats)" },
  ];

  if (loading) {
    return (
      <div style={{ background: BG, minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", color: MUTED, fontFamily: "'Inter', sans-serif" }}>
        Cargando datos...
      </div>
    );
  }

  return (
    <div style={{ background: BG, minHeight: "100vh", padding: "28px 20px", fontFamily: "'Inter', sans-serif", color: TEXT }}>
      {/* Header */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
          <span style={{ fontSize: 22, color: BTC_COLOR }}>₿</span>
          <h1 style={{ margin: 0, fontSize: 20, fontWeight: 700, letterSpacing: "-0.3px" }}>DCA Bitcoin</h1>
        </div>
        <p style={{ margin: 0, color: MUTED, fontSize: 13 }}>Intereses en ARS de billeteras virtuales · acumulación diaria</p>
      </div>

      {/* Selector de mes */}
      <div style={{ display: "flex", gap: 6, marginBottom: 16, position: "relative", flexWrap: "wrap" }}>
        <div style={{ position: "relative" }}>
          <button
            onClick={() => setShowMesesMenu((s) => !s)}
            style={{ ...pillButtonStyle(!!mesInfo), display: "flex", alignItems: "center", gap: 6 }}
          >
            {mesInfo ? mesLabel : "Meses"} {showMesesMenu ? "▲" : "▼"}
          </button>
          {showMesesMenu && (
            <div
              style={{
                position: "absolute",
                top: "calc(100% + 6px)",
                left: 0,
                background: CARD,
                border: `1px solid ${BORDER}`,
                borderRadius: 8,
                overflow: "hidden",
                zIndex: 10,
                minWidth: 160,
              }}
            >
              {MESES.map((m) => (
                <button
                  key={m.id}
                  onClick={() => { setMesActivo(m.id); setTab("ars"); setShowMesesMenu(false); }}
                  style={{
                    display: "block",
                    width: "100%",
                    textAlign: "left",
                    background: mesActivo === m.id ? "#2a2a36" : "transparent",
                    color: mesActivo === m.id ? TEXT : MUTED,
                    border: "none",
                    padding: "9px 16px",
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  {m.label}
                </button>
              ))}
            </div>
          )}
        </div>
        <button onClick={() => setMesActivo("comparar")} style={pillButtonStyle(mesActivo === "comparar", GREEN)}>
          Comparar meses
        </button>
        <button onClick={() => setMesActivo("acumtotal")} style={pillButtonStyle(mesActivo === "acumtotal", BTC_COLOR)}>
          Acumulado total
        </button>
        <button onClick={() => setMesActivo("ganancia")} style={pillButtonStyle(mesActivo === "ganancia", GREEN)}>
          Ganancia
        </button>
      </div>

      {mesActivo === "comparar" ? (
        <ComparacionMeses datosPorMes={datosPorMes} />
      ) : mesActivo === "acumtotal" ? (
        <AcumuladoTotal datosPorMes={datosPorMes} />
      ) : mesActivo === "ganancia" ? (
        <Ganancia datosPorMes={datosPorMes} />
      ) : (
        <>
          {/* Tendencia vs mes anterior */}
          {(() => {
            const idx = MESES.findIndex((m) => m.id === mesActivo);
            if (idx <= 0) return null;
            const totAnterior = totales(datosPorMes[MESES[idx - 1].id]);
            if (totAnterior.n === 0) return null;
            const variacion = ((tot.avgArs - totAnterior.avgArs) / totAnterior.avgArs) * 100;
            const subiendo = variacion > 0;
            const color = subiendo ? GREEN : RED;
            return (
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16, fontSize: 13 }}>
                <span style={{ color, fontWeight: 700 }}>{subiendo ? "↑" : "↓"} {Math.abs(variacion).toFixed(1)}%</span>
                <span style={{ color: MUTED }}>promedio diario vs. {MESES[idx - 1].label}</span>
              </div>
            );
          })()}

          {/* Summary cards */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(110px, 1fr))", gap: 12, marginBottom: 20 }}>
            {[
              { label: "Total ARS", value: formatARS(tot.totalArs), sub: `Prom. ${formatARS(tot.avgArs)}/día`, color: ARS_COLOR },
              { label: "Total BTC", value: formatBTC(tot.totalBtc), sub: `Prom. ${formatBTC(tot.avgBtc)}/día`, color: BTC_COLOR },
              { label: "Precio prom.", value: tot.totalBtc ? formatARS(tot.totalArs / tot.totalBtc) : "—", sub: "ARS por BTC", color: GREEN },
            ].map((c) => (
              <div key={c.label} style={statCardStyle}>
                <p style={statLabelStyle}>{c.label}</p>
                <p style={{ margin: "0 0 2px", fontSize: 16, fontWeight: 700, color: c.color }}>{c.value}</p>
                <p style={{ margin: 0, fontSize: 11, color: MUTED }}>{c.sub}</p>
              </div>
            ))}
          </div>

          {mesInfo?.editable && (
            <div style={{ marginBottom: 20 }}>
              {!showForm ? (
                <button
                  onClick={() => setShowForm(true)}
                  style={{ background: BTC_COLOR, color: "#000", border: "none", borderRadius: 8, padding: "9px 16px", fontSize: 13, fontWeight: 700, cursor: "pointer" }}
                >
                  + Cargar compra de {mesLabel}
                </button>
              ) : (
                <div style={cardStyle({ padding: 16 })}>
                  <p style={{ margin: "0 0 12px", fontSize: 13, fontWeight: 700, color: TEXT }}>Nueva compra · {mesLabel}</p>
                  <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 10 }}>
                    <input
                      placeholder="Día"
                      value={formDia}
                      onChange={(e) => setFormDia(e.target.value)}
                      style={{ background: "#0f0f14", border: `1px solid ${BORDER}`, borderRadius: 6, padding: "8px 10px", color: TEXT, fontSize: 13, width: 100 }}
                    />
                    <input
                      placeholder="ARS invertidos (0 si no hubo compra)"
                      value={formArs}
                      onChange={(e) => setFormArs(e.target.value)}
                      style={{ background: "#0f0f14", border: `1px solid ${BORDER}`, borderRadius: 6, padding: "8px 10px", color: TEXT, fontSize: 13, width: 200 }}
                    />
                    <input
                      placeholder="BTC comprado (0 si no hubo compra)"
                      value={formBtc}
                      onChange={(e) => setFormBtc(e.target.value)}
                      style={{ background: "#0f0f14", border: `1px solid ${BORDER}`, borderRadius: 6, padding: "8px 10px", color: TEXT, fontSize: 13, width: 220 }}
                    />
                  </div>
                  {saveError && <p style={{ color: RED, fontSize: 12, margin: "0 0 10px" }}>{saveError}</p>}
                  <div style={{ display: "flex", gap: 8 }}>
                    <button onClick={handleAddEntry} style={{ background: GREEN, color: "#000", border: "none", borderRadius: 6, padding: "7px 14px", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>
                      Guardar
                    </button>
                    <button onClick={() => { setShowForm(false); setSaveError(""); }} style={{ background: "transparent", color: MUTED, border: `1px solid ${BORDER}`, borderRadius: 6, padding: "7px 14px", fontSize: 12, cursor: "pointer" }}>
                      Cancelar
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {data.length === 0 ? (
            <div style={cardStyle({ padding: 40, textAlign: "center", color: MUTED, fontSize: 13 })}>
              Todavía no hay compras cargadas para {mesLabel}. Usá el botón de arriba o pasame los datos por chat.
            </div>
          ) : (
            <>
              {/* Tabs */}
              <div style={{ display: "flex", gap: 6, marginBottom: 16, flexWrap: "wrap" }}>
                {tabs.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setTab(t.id)}
                    style={{
                      background: tab === t.id ? BTC_COLOR : CARD,
                      color: tab === t.id ? "#000" : MUTED,
                      border: `1px solid ${tab === t.id ? BTC_COLOR : BORDER}`,
                      borderRadius: 20,
                      padding: "6px 14px",
                      fontSize: 12,
                      fontWeight: 600,
                      cursor: "pointer",
                    }}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              {/* Chart */}
              <div style={cardStyle({ padding: "20px 8px 10px" })}>
                <ResponsiveContainer width="100%" height={240}>
                  {tab === "ars" ? (
                    <LineChart data={data} margin={{ left: 0, right: 16 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke={BORDER} />
                      <XAxis dataKey="fecha" tick={{ fill: MUTED, fontSize: 12 }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fill: MUTED, fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                      <Tooltip content={<ChartTooltip formatter={(p) => `${p.name}: ${formatARS(p.value)}`} />} />
                      <Line type="monotone" dataKey="ars" name="ARS" stroke={ARS_COLOR} strokeWidth={2.5} dot={{ r: 4, fill: ARS_COLOR }} />
                    </LineChart>
                  ) : tab === "acum" ? (
                    <LineChart data={data} margin={{ left: 0, right: 16 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke={BORDER} />
                      <XAxis dataKey="fecha" tick={{ fill: MUTED, fontSize: 12 }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fill: MUTED, fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={(v) => `${(v / 1000).toFixed(1)}k`} />
                      <Tooltip content={<ChartTooltip color={BTC_COLOR} formatter={(p) => `${formatSats(p.value)} sats`} />} />
                      <Line type="monotone" dataKey="satsAcum" name="Satoshis acumulados" stroke={BTC_COLOR} strokeWidth={2.5} dot={{ r: 4, fill: BTC_COLOR }} />
                    </LineChart>
                  ) : (
                    <LineChart data={data} margin={{ left: 0, right: 16 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke={BORDER} />
                      <XAxis dataKey="fecha" tick={{ fill: MUTED, fontSize: 12 }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fill: MUTED, fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={(v) => v.toFixed(5)} />
                      <Tooltip content={<ChartTooltip formatter={(p) => `${p.name}: ${formatBTC(p.value)} BTC`} />} />
                      <Line type="monotone" dataKey="btc" name="BTC" stroke={BTC_COLOR} strokeWidth={2.5} dot={{ r: 4, fill: BTC_COLOR }} />
                    </LineChart>
                  )}
                </ResponsiveContainer>
              </div>

              {/* Table */}
              <div style={{ marginTop: 20, ...cardStyle({ overflow: "hidden" }) }}>
                <button
                  onClick={() => setShowTable((s) => !s)}
                  style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", background: "transparent", border: "none", padding: "12px 14px", cursor: "pointer", color: TEXT }}
                >
                  <span style={{ fontSize: 12, fontWeight: 700, color: MUTED, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                    Detalle diario ({data.length} {data.length === 1 ? "compra" : "compras"})
                  </span>
                  <span style={{ color: MUTED, fontSize: 12 }}>{showTable ? "Ocultar ▲" : "Ver ▼"}</span>
                </button>
                {showTable && (
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                    <thead>
                      <tr style={{ borderBottom: `1px solid ${BORDER}` }}>
                        {["Fecha", "ARS", "BTC", "Precio ARS/BTC"].map((h) => (
                          <th key={h} style={{ padding: "10px 14px", color: MUTED, fontWeight: 600, textAlign: "right", textTransform: "uppercase", letterSpacing: "0.5px", fontSize: 10 }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {data.map((d, i) => (
                        <tr key={d.fecha} style={{ borderBottom: i < data.length - 1 ? `1px solid ${BORDER}` : "none" }}>
                          <td style={{ padding: "9px 14px", color: TEXT, fontWeight: 600, textAlign: "right" }}>{d.fecha}</td>
                          <td style={{ padding: "9px 14px", color: ARS_COLOR, textAlign: "right" }}>{formatARS(d.ars)}</td>
                          <td style={{ padding: "9px 14px", color: BTC_COLOR, textAlign: "right" }}>{formatBTC(d.btc)}</td>
                          <td style={{ padding: "9px 14px", color: MUTED, textAlign: "right" }}>{d.precio != null ? formatARS(d.precio) : "—"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
                <div style={{ borderTop: `1px solid ${BORDER}`, background: "#1c1c26", display: "flex", justifyContent: "space-between", padding: "9px 14px" }}>
                  <span style={{ color: MUTED, fontWeight: 700, fontSize: 11 }}>TOTAL</span>
                  <div style={{ display: "flex", gap: 20 }}>
                    <span style={{ color: ARS_COLOR, fontWeight: 700, fontSize: 12 }}>{formatARS(tot.totalArs)}</span>
                    <span style={{ color: BTC_COLOR, fontWeight: 700, fontSize: 12 }}>{formatBTC(tot.totalBtc)}</span>
                  </div>
                </div>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}

function ComparacionMeses({ datosPorMes }) {
  const resumen = MESES.map((m) => ({ ...m, tot: totales(datosPorMes[m.id]) }));
  const activos = resumen.filter((m) => m.tot.n > 0);

  // Gráfico de línea reutilizable para las 3 comparativas de abajo (BTC, ARS, sats/día).
  // `valueFn` recibe los totales de un mes y devuelve el número a graficar.
  const MiniLineChart = ({ valueFn, color, unitLabel, tickFormatter, tooltipFormatter }) => {
    const chartData = resumen.map((m) => ({ mes: m.label.split(" ")[0], valor: valueFn(m.tot) }));
    return (
      <div style={{ marginTop: 20, ...cardStyle({ padding: "20px 8px 10px" }) }}>
        <p style={{ margin: "0 0 10px 8px", fontSize: 11, color, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px" }}>
          {unitLabel}
        </p>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={chartData} margin={{ left: 0, right: 16 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={BORDER} />
            <XAxis dataKey="mes" tick={{ fill: MUTED, fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: MUTED, fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={tickFormatter} />
            <Tooltip content={<ChartTooltip color={color} formatter={(p) => tooltipFormatter(p.value)} />} />
            <Line type="monotone" dataKey="valor" name={unitLabel} stroke={color} strokeWidth={2.5} dot={{ r: 5, fill: color }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    );
  };

  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 12, marginBottom: 20 }}>
        {resumen.map((m) => (
          <div key={m.id} style={cardStyle({ padding: 16 })}>
            <p style={{ margin: "0 0 10px", fontSize: 13, fontWeight: 700, color: TEXT }}>{m.label}</p>
            {m.tot.n === 0 ? (
              <p style={{ color: MUTED, fontSize: 12, margin: 0 }}>Sin compras cargadas</p>
            ) : (
              <>
                <p style={{ margin: "0 0 4px", fontSize: 11, color: MUTED }}>Compras: {m.tot.n}</p>
                <p style={{ margin: "0 0 4px", fontSize: 14, fontWeight: 700, color: ARS_COLOR }}>{formatARS(m.tot.totalArs)}</p>
                <p style={{ margin: "0 0 8px", fontSize: 11, color: MUTED }}>Prom. {formatARS(m.tot.avgArs)}/día</p>
                <p style={{ margin: "0 0 4px", fontSize: 14, fontWeight: 700, color: BTC_COLOR }}>{formatBTC(m.tot.totalBtc)}</p>
                <p style={{ margin: 0, fontSize: 11, color: MUTED }}>Prom. {formatBTC(m.tot.avgBtc)}/día</p>
              </>
            )}
          </div>
        ))}
      </div>

      <div style={cardStyle({ overflow: "hidden" })}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
          <thead>
            <tr style={{ borderBottom: `1px solid ${BORDER}` }}>
              <th style={{ padding: "10px 14px", color: MUTED, textAlign: "left", fontSize: 10, textTransform: "uppercase" }}>Mes</th>
              <th style={{ padding: "10px 14px", color: MUTED, textAlign: "right", fontSize: 10, textTransform: "uppercase" }}>Total ARS</th>
              <th style={{ padding: "10px 14px", color: MUTED, textAlign: "right", fontSize: 10, textTransform: "uppercase" }}>Total BTC</th>
              <th style={{ padding: "10px 14px", color: MUTED, textAlign: "right", fontSize: 10, textTransform: "uppercase" }}>Precio prom.</th>
            </tr>
          </thead>
          <tbody>
            {resumen.map((m) => (
              <tr key={m.id} style={{ borderBottom: `1px solid ${BORDER}` }}>
                <td style={{ padding: "9px 14px", color: TEXT, fontWeight: 600 }}>{m.label}</td>
                <td style={{ padding: "9px 14px", color: ARS_COLOR, textAlign: "right" }}>{m.tot.n ? formatARS(m.tot.totalArs) : "—"}</td>
                <td style={{ padding: "9px 14px", color: BTC_COLOR, textAlign: "right" }}>{m.tot.n ? formatBTC(m.tot.totalBtc) : "—"}</td>
                <td style={{ padding: "9px 14px", color: MUTED, textAlign: "right" }}>{m.tot.n && m.tot.totalBtc ? formatARS(m.tot.totalArs / m.tot.totalBtc) : "—"}</td>
              </tr>
            ))}
            {activos.length > 0 && (() => {
              const sumaArs = activos.reduce((s, m) => s + m.tot.totalArs, 0);
              const sumaBtc = activos.reduce((s, m) => s + m.tot.totalBtc, 0);
              const promPrecio = activos.reduce((s, m) => s + m.tot.totalArs / m.tot.totalBtc, 0) / activos.length;
              const totalDias = activos.reduce((s, m) => s + m.tot.n, 0);
              return (
                <>
                  <tr style={{ background: "#1c1c26", borderTop: `1px solid ${BTC_COLOR}` }}>
                    <td style={{ padding: "10px 14px", color: MUTED, fontWeight: 700, fontSize: 11, textTransform: "uppercase" }}>Total acumulado</td>
                    <td style={{ padding: "10px 14px", color: ARS_COLOR, fontWeight: 700, textAlign: "right" }}>{formatARS(sumaArs)}</td>
                    <td style={{ padding: "10px 14px", color: BTC_COLOR, fontWeight: 700, textAlign: "right" }}>{formatBTC(sumaBtc)}</td>
                    <td style={{ padding: "10px 14px", color: MUTED, fontWeight: 700, textAlign: "right" }}>{formatARS(promPrecio)}</td>
                  </tr>
                  <tr style={{ background: "#15151c" }}>
                    <td style={{ padding: "10px 14px", color: MUTED, fontWeight: 700, fontSize: 11, textTransform: "uppercase" }}>Promedio por día ({totalDias} días)</td>
                    <td style={{ padding: "10px 14px", color: ARS_COLOR, fontWeight: 700, textAlign: "right" }}>{formatARS(sumaArs / totalDias)}</td>
                    <td style={{ padding: "10px 14px", color: BTC_COLOR, fontWeight: 700, textAlign: "right" }}>{formatBTC(sumaBtc / totalDias)}</td>
                    <td style={{ padding: "10px 14px", color: MUTED, textAlign: "right" }}>—</td>
                  </tr>
                </>
              );
            })()}
          </tbody>
        </table>
      </div>

      <MiniLineChart valueFn={(t) => t.totalBtc} color={BTC_COLOR} unitLabel="BTC obtenido por mes" tickFormatter={(v) => v.toFixed(5)} tooltipFormatter={(v) => `${formatBTC(v)} BTC`} />
      <MiniLineChart valueFn={(t) => t.totalArs} color={BLUE} unitLabel="ARS invertido por mes" tickFormatter={(v) => `$${(v / 1000).toFixed(1)}k`} tooltipFormatter={(v) => formatARS(v)} />
      <MiniLineChart valueFn={(t) => t.avgBtc * 100000000} color={BTC_COLOR} unitLabel="Promedio de satoshis comprados por día, por mes" tickFormatter={(v) => formatSats(v)} tooltipFormatter={(v) => `${formatSats(v)} sats/día`} />
    </div>
  );
}

function AcumuladoTotal({ datosPorMes }) {
  const resumen = MESES.map((m) => ({ ...m, data: datosPorMes[m.id] })).filter((m) => m.data.length > 0);

  let acumSats = 0;
  const chartData = [];
  resumen.forEach((m) => {
    m.data.forEach((d) => {
      acumSats += d.btc * 100000000;
      chartData.push({ fecha: d.fecha, satsAcum: acumSats });
    });
  });

  return (
    <div style={cardStyle({ padding: "20px 8px 10px" })}>
      <p style={{ margin: "0 0 10px 8px", fontSize: 11, color: BTC_COLOR, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px" }}>
        Satoshis acumulados (día a día, todos los meses)
      </p>
      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={chartData} margin={{ left: 0, right: 16 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={BORDER} />
          <XAxis dataKey="fecha" tick={{ fill: MUTED, fontSize: 9 }} axisLine={false} tickLine={false} interval={Math.ceil(chartData.length / 12)} />
          <YAxis tick={{ fill: MUTED, fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={(v) => `${(v / 1000).toFixed(1)}k`} />
          <Tooltip content={<ChartTooltip color={BTC_COLOR} formatter={(p) => `${formatSats(p.value)} sats`} />} />
          <Line type="monotone" dataKey="satsAcum" name="Satoshis acumulados" stroke={BTC_COLOR} strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

function Ganancia({ datosPorMes }) {
  const mesesConDatos = MESES.filter((m) => (datosPorMes[m.id] || []).length > 0);

  if (mesesConDatos.length === 0) {
    return (
      <div style={cardStyle({ padding: 40, textAlign: "center", color: MUTED, fontSize: 13 })}>
        Todavía no hay compras cargadas.
      </div>
    );
  }

  const todasLasEntradas = mesesConDatos.flatMap((m) => datosPorMes[m.id]);
  const totalArs = todasLasEntradas.reduce((s, e) => s + e.ars, 0);
  const totalBtc = todasLasEntradas.reduce((s, e) => s + e.btc, 0);

  // Última compra real: último mes con datos, día más alto con btc > 0 dentro de ese mes
  // (los días sin compra cargada como 0/0 no sirven de referencia de precio).
  const ultimoMes = mesesConDatos[mesesConDatos.length - 1];
  const entradasConPrecio = datosPorMes[ultimoMes.id].filter((e) => e.btc > 0);
  const ultimaCompra = [...entradasConPrecio].sort((a, b) => b.dia - a.dia)[0];

  const precioReferencia = ultimaCompra.ars / ultimaCompra.btc;
  const valorizacion = totalBtc * precioReferencia;
  const gananciaArs = valorizacion - totalArs;
  const porcentaje = (gananciaArs / totalArs) * 100;
  const esGanancia = gananciaArs >= 0;
  const color = esGanancia ? GREEN : RED;
  const signo = esGanancia ? "+" : "";

  return (
    <div>
      <div style={{ marginBottom: 16, fontSize: 13, color: MUTED }}>
        Fecha de corte: <span style={{ color: TEXT, fontWeight: 600 }}>{ultimaCompra.fecha}</span> · precio de referencia tomado de la última compra cargada ({ultimoMes.label})
      </div>

      <div style={{ ...cardStyle({ padding: 24, marginBottom: 16, textAlign: "center" }), border: `1px solid ${color}` }}>
        <p style={statLabelStyle}>Ganancia / Pérdida</p>
        <p style={{ margin: "0 0 4px", fontSize: 32, fontWeight: 800, color }}>{signo}{formatARS(gananciaArs)}</p>
        <p style={{ margin: 0, fontSize: 18, fontWeight: 700, color }}>{signo}{porcentaje.toFixed(2)}%</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 12 }}>
        {[
          { label: "Total invertido", value: formatARS(totalArs), color: ARS_COLOR },
          { label: "BTC acumulados", value: `${formatBTC(totalBtc)} (${formatSats(totalBtc * 100000000)} sats)`, color: BTC_COLOR },
          { label: "Precio BTC de referencia", value: formatARS(precioReferencia), color: BLUE },
          { label: "Valorización actual", value: formatARS(valorizacion), color: GREEN },
        ].map((c) => (
          <div key={c.label} style={statCardStyle}>
            <p style={statLabelStyle}>{c.label}</p>
            <p style={{ margin: 0, fontSize: 16, fontWeight: 700, color: c.color }}>{c.value}</p>
          </div>
        ))}
      </div>

      <p style={{ marginTop: 16, fontSize: 11, color: MUTED, lineHeight: 1.5 }}>
        El precio de referencia surge de la última compra cargada ({ultimaCompra.fecha}): {formatARS(ultimaCompra.ars)} ÷ {formatBTC(ultimaCompra.btc)} BTC = {formatARS(precioReferencia)} por BTC.
        No refleja necesariamente la cotización de mercado del BTC en esa fecha, sino el precio implícito de tu última operación de DCA.
      </p>
    </div>
  );
}
