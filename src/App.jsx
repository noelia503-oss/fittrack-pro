import React, { useState, useEffect } from 'react';
import { trainingPlan } from './data/trainingData';
import { warmupData } from './data/warmupData';
import { tipsData } from './data/tipsData';
import { scoringData } from './data/scoringData';
import { Activity, Clock, Heart, Move, ChevronRight, Zap, Info, Lightbulb, Target, Calculator, User, UserPlus, Star, CheckCircle, Circle } from 'lucide-react';

const App = () => {
    const [activeDay, setActiveDay] = useState(1);
    const [showWarmup, setShowWarmup] = useState(false);
    const [showTips, setShowTips] = useState(false);
    const [activeTipTab, setActiveTipTab] = useState('navette');

    // Estados Simulador de Puntos (Fijado a Mujeres)
    const gender = 'mujeres';
    const [marks, setMarks] = useState({
        navette: 0,
        pressBanca: 0,
        agilidad: 15,
        natacion: 60
    });

    // Estado Checklist de Entrenamiento (Persistencia Local)
    const [completedSessions, setCompletedSessions] = useState(() => {
        const saved = localStorage.getItem('fitTrack_completed');
        return saved ? JSON.parse(saved) : {};
    });

    useEffect(() => {
        localStorage.setItem('fitTrack_completed', JSON.stringify(completedSessions));
    }, [completedSessions]);

    const toggleSession = (day, sessionType) => {
        const key = `day${day}_${sessionType}`;
        setCompletedSessions(prev => ({
            ...prev,
            [key]: !prev[key]
        }));
    };

    const todayData = trainingPlan.find(d => d.day === activeDay);

    // Función de cálculo de puntos
    const calculatePoints = (test, value) => {
        const baremos = scoringData[gender][test];
        let points = 0;

        if (test === 'pressBanca' || test === 'navette') {
            // Buscamos el valor más alto que sea <= al introducido
            const match = [...baremos].sort((a, b) => b.min - a.min).find(b => value >= b.min);
            points = match ? match.points : 0;
        } else {
            // Buscamos el valor más bajo que sea >= al introducido (tiempos)
            const match = [...baremos].sort((a, b) => a.max - b.max).find(b => value <= b.max);
            points = match ? match.points : 0;
        }
        return points;
    };

    const totalPoints = (
        calculatePoints('navette', marks.navette) +
        calculatePoints('pressBanca', marks.pressBanca) +
        calculatePoints('agilidad', marks.agilidad) +
        calculatePoints('natacion', marks.natacion)
    ).toFixed(1);

    return (
        <div className="card-container">
            <header style={{ marginBottom: '2rem', textAlign: 'center' }}>
                <h1 className="glow-text" style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>FitTrack Pro</h1>
                <p style={{ color: 'var(--text-muted)' }}>Promo 35 · Plan de Alto Rendimiento</p>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>

                {/* Panel Izquierdo: Entrenamiento */}
                <section className="glass" style={{ padding: '1.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <h2 style={{ fontSize: '1.5rem' }}>Día {todayData.day}: {todayData.date}</h2>
                        <select
                            value={activeDay}
                            onChange={(e) => setActiveDay(parseInt(e.target.value))}
                            style={{ background: 'transparent', color: 'white', border: '1px solid var(--glass-border)', padding: '5px', borderRadius: '8px' }}
                        >
                            {[...Array(11)].map((_, i) => (
                                <option key={i + 1} value={i + 1} style={{ background: '#1e293b' }}>Día {i + 1}</option>
                            ))}
                        </select>
                    </div>

                    <h3 style={{ color: 'var(--primary)', marginBottom: '1rem', fontWeight: '500' }}>{todayData.title}</h3>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {/* Mañana */}
                        <div
                            onClick={() => toggleSession(activeDay, 'morning')}
                            style={{
                                background: completedSessions[`day${activeDay}_morning`] ? 'rgba(34, 197, 94, 0.1)' : 'rgba(99, 102, 241, 0.1)',
                                padding: '1rem',
                                borderRadius: '16px',
                                borderLeft: `4px solid ${completedSessions[`day${activeDay}_morning`] ? '#22c55e' : 'var(--primary)'}`,
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                                opacity: completedSessions[`day${activeDay}_morning`] ? 0.7 : 1
                            }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <Clock size={16} color={completedSessions[`day${activeDay}_morning`] ? '#22c55e' : 'var(--primary)'} />
                                    <span style={{ fontWeight: '600', fontSize: '0.9rem', textDecoration: completedSessions[`day${activeDay}_morning`] ? 'line-through' : 'none' }}>SESIÓN MAÑANA: {todayData.morning.type}</span>
                                </div>
                                {completedSessions[`day${activeDay}_morning`] ? <CheckCircle size={18} color="#22c55e" /> : <Circle size={18} color="var(--text-muted)" />}
                            </div>
                            <p style={{ fontSize: '0.95rem', marginBottom: '0.5rem', color: completedSessions[`day${activeDay}_morning`] ? 'var(--text-muted)' : 'var(--text-main)' }}>{todayData.morning.description}</p>
                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '6px', fontSize: '0.85rem', color: 'var(--accent-cyan)' }}>
                                <Zap size={14} />
                                <span>Meta: {todayData.morning.goal}</span>
                            </div>
                        </div>

                        {/* Tarde */}
                        <div
                            onClick={() => toggleSession(activeDay, 'afternoon')}
                            style={{
                                background: completedSessions[`day${activeDay}_afternoon`] ? 'rgba(34, 197, 94, 0.1)' : 'rgba(168, 85, 247, 0.1)',
                                padding: '1rem',
                                borderRadius: '16px',
                                borderLeft: `4px solid ${completedSessions[`day${activeDay}_afternoon`] ? '#22c55e' : 'var(--secondary)'}`,
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                                opacity: completedSessions[`day${activeDay}_afternoon`] ? 0.7 : 1
                            }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <Activity size={16} color={completedSessions[`day${activeDay}_afternoon`] ? '#22c55e' : 'var(--secondary)'} />
                                    <span style={{ fontWeight: '600', fontSize: '0.9rem', textDecoration: completedSessions[`day${activeDay}_afternoon`] ? 'line-through' : 'none' }}>SESIÓN TARDE: {todayData.afternoon.type}</span>
                                </div>
                                {completedSessions[`day${activeDay}_afternoon`] ? <CheckCircle size={18} color="#22c55e" /> : <Circle size={18} color="var(--text-muted)" />}
                            </div>
                            <p style={{ fontSize: '0.95rem', marginBottom: '0.5rem', color: completedSessions[`day${activeDay}_afternoon`] ? 'var(--text-muted)' : 'var(--text-main)' }}>{todayData.afternoon.description}</p>
                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '6px', fontSize: '0.85rem', color: 'var(--accent-pink)' }}>
                                <Zap size={14} />
                                <span>Meta: {todayData.afternoon.goal}</span>
                            </div>
                        </div>
                    </div>

                    {/* Ejercicios Complementarios */}
                    {todayData.complementary && (
                        <div style={{ marginTop: '0.5rem', background: 'rgba(255, 255, 255, 0.03)', padding: '1rem', borderRadius: '16px', border: '1px dashed rgba(255,255,255,0.1)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.8rem' }}>
                                <Star size={16} color="var(--accent-pink)" fill="var(--accent-pink)" />
                                <span style={{ fontWeight: '700', fontSize: '0.85rem', letterSpacing: '0.05rem', color: 'var(--accent-pink)' }}>EXTRAS (SI TIENES ENERGÍA)</span>
                            </div>
                            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                                {todayData.complementary.map((exercise, idx) => {
                                    const exKey = `day${activeDay}_ex${idx}`;
                                    const isDone = completedSessions[exKey];
                                    return (
                                        <li
                                            key={idx}
                                            onClick={() => toggleSession(activeDay, `ex${idx}`)}
                                            style={{
                                                fontSize: '0.85rem',
                                                marginBottom: '6px',
                                                display: 'flex',
                                                gap: '8px',
                                                cursor: 'pointer',
                                                opacity: isDone ? 0.6 : 1,
                                                transition: 'all 0.2s ease'
                                            }}
                                        >
                                            {isDone ? <CheckCircle size={14} color="#22c55e" /> : <span style={{ color: 'var(--accent-pink)' }}>•</span>}
                                            <span style={{ color: isDone ? 'var(--text-muted)' : 'var(--text-main)', textDecoration: isDone ? 'line-through' : 'none' }}>
                                                {exercise}
                                            </span>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    )}

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '1.5rem' }}>
                        <button
                            onClick={() => { setShowWarmup(!showWarmup); setShowTips(false); }}
                            style={{
                                padding: '12px', borderRadius: '12px', background: showWarmup ? 'var(--primary)' : 'rgba(255,255,255,0.05)',
                                color: 'white', border: '1px solid var(--glass-border)', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
                            }}
                        >
                            <Info size={16} /> Calentamiento
                        </button>
                        <button
                            onClick={() => { setShowTips(!showTips); setShowWarmup(false); }}
                            style={{
                                padding: '12px', borderRadius: '12px', background: showTips ? 'var(--secondary)' : 'rgba(255,255,255,0.05)',
                                color: 'white', border: '1px solid var(--glass-border)', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
                            }}
                        >
                            <Lightbulb size={16} /> Técnicas Pro
                        </button>
                    </div>
                </section>

                {/* Panel Derecho: Simulador de Puntos */}
                <section className="glass" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <h2 style={{ fontSize: '1.2rem', color: 'var(--accent-pink)', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem' }}>
                        <Calculator size={20} /> Simulador de Puntos (Baremo Mujer)
                    </h2>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {/* Course Navette */}
                        <div className="input-group">
                            <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>COURSE NAVETTE (Periodo)</label>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <input
                                    type="number" step="0.5" value={marks.navette}
                                    onChange={(e) => setMarks({ ...marks, navette: parseFloat(e.target.value) || 0 })}
                                    style={{ flex: 1, background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', color: 'white', padding: '10px', borderRadius: '10px' }}
                                />
                                <span style={{ width: '60px', textAlign: 'right', color: 'var(--accent-cyan)', fontWeight: '700' }}>{calculatePoints('navette', marks.navette)} pts</span>
                            </div>
                        </div>

                        {/* Press Banca */}
                        <div className="input-group">
                            <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>PRESS BANCA (Reps)</label>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <input
                                    type="number" value={marks.pressBanca}
                                    onChange={(e) => setMarks({ ...marks, pressBanca: parseInt(e.target.value) || 0 })}
                                    style={{ flex: 1, background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', color: 'white', padding: '10px', borderRadius: '10px' }}
                                />
                                <span style={{ width: '60px', textAlign: 'right', color: 'var(--accent-cyan)', fontWeight: '700' }}>{calculatePoints('pressBanca', marks.pressBanca)} pts</span>
                            </div>
                        </div>

                        {/* Agilidad */}
                        <div className="input-group">
                            <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>AGILIDAD (Segundos)</label>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <input
                                    type="number" step="0.01" value={marks.agilidad}
                                    onChange={(e) => setMarks({ ...marks, agilidad: parseFloat(e.target.value) || 0 })}
                                    style={{ flex: 1, background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', color: 'white', padding: '10px', borderRadius: '10px' }}
                                />
                                <span style={{ width: '60px', textAlign: 'right', color: 'var(--accent-cyan)', fontWeight: '700' }}>{calculatePoints('agilidad', marks.agilidad)} pts</span>
                            </div>
                        </div>

                        {/* Natación */}
                        <div className="input-group">
                            <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>NATACIÓN 50m (Segundos)</label>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <input
                                    type="number" step="0.01" value={marks.natacion}
                                    onChange={(e) => setMarks({ ...marks, natacion: parseFloat(e.target.value) || 0 })}
                                    style={{ flex: 1, background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', color: 'white', padding: '10px', borderRadius: '10px' }}
                                />
                                <span style={{ width: '60px', textAlign: 'right', color: 'var(--accent-cyan)', fontWeight: '700' }}>{calculatePoints('natacion', marks.natacion)} pts</span>
                            </div>
                        </div>
                    </div>

                    <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid var(--glass-border)', textAlign: 'center' }}>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px' }}>PUNTUACIÓN TOTAL ESTIMADA</div>
                        <div style={{ fontSize: '3rem', fontWeight: '800', background: 'linear-gradient(to right, var(--accent-pink), var(--secondary))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                            {totalPoints} <span style={{ fontSize: '1.2rem' }}>/ 80</span>
                        </div>
                    </div>
                </section>
            </div>

            {/* Modal / Sección de Calentamiento */}
            {
                showWarmup && (
                    <section className="glass" style={{ marginTop: '1.5rem', padding: '1.5rem', animation: 'fadeIn 0.3s ease' }}>
                        <h2 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Zap color="var(--accent-cyan)" /> Guía de Calentamiento Específica
                        </h2>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
                            <div>
                                <h4 style={{ color: 'var(--text-muted)', marginBottom: '0.5rem' }}>FASE GENERAL</h4>
                                <ul style={{ fontSize: '0.85rem', listStyle: 'none' }}>
                                    {warmupData.general.map((item, i) => <li key={i} style={{ marginBottom: '4px' }}>• {item}</li>)}
                                </ul>
                            </div>
                            <div>
                                <h4 style={{ color: 'var(--text-muted)', marginBottom: '0.5rem' }}>ESPECÍFICO: {todayData.morning.type}</h4>
                                <ul style={{ fontSize: '0.85rem', listStyle: 'none' }}>
                                    {warmupData.navette.map((item, i) => <li key={i} style={{ marginBottom: '4px' }}>• {item}</li>)}
                                </ul>
                            </div>
                        </div>
                    </section>
                )
            }

            {showTips && (
                <section className="glass" style={{ marginTop: '1.5rem', padding: '1.5rem', animation: 'fadeIn 0.3s ease-out' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <h2 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Lightbulb color="var(--accent-cyan)" /> Guía de Técnicas Pro
                        </h2>
                        <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '5px' }}>
                            {Object.keys(tipsData).map(key => (
                                <button
                                    key={key}
                                    onClick={() => setActiveTipTab(key)}
                                    style={{
                                        padding: '6px 12px', borderRadius: '8px',
                                        background: activeTipTab === key ? 'var(--primary)' : 'transparent',
                                        color: 'white', border: '1px solid var(--glass-border)', fontSize: '0.8rem', cursor: 'pointer', whiteSpace: 'nowrap'
                                    }}
                                >
                                    {key.toUpperCase()}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
                        {tipsData[activeTipTab].map((tip, i) => (
                            <div key={i} style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '16px', border: '1px solid var(--glass-border)' }}>
                                <h4 style={{ color: 'var(--accent-cyan)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <Target size={14} /> {tip.title}
                                </h4>
                                <p style={{ fontSize: '0.85rem', color: 'var(--text-main)', lineHeight: '1.4' }}>{tip.text}</p>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
        </div >
    );
};

export default App;
