import React, { useRef, useMemo, useState, useEffect, useCallback } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, Box, Stars, Text, Sphere, Cone, Octahedron, Cloud, Sky, Billboard, Float } from '@react-three/drei'
import * as THREE from 'three'

// ==========================================
// 1. 視覺環境組件 (Visual Components)
// ==========================================

function DataMotes({ isDay }) {
  const points = useMemo(() => {
    return Array.from({ length: 80 }, () => ({
      pos: [(Math.random() - 0.5) * 50, Math.random() * 25, (Math.random() - 0.5) * 50],
      speed: 0.02 + Math.random() * 0.05
    }))
  }, [])
  return (
    <group>
      {points.map((p, i) => (
        <Float key={i} speed={p.speed} rotationIntensity={0.5} floatIntensity={0.5}>
          <mesh position={p.pos}>
            <sphereGeometry args={[0.06, 8, 8]} />
            <meshStandardMaterial color={isDay ? "#4db8ff" : "#FFD700"} transparent opacity={0.4} emissive={isDay ? "#4db8ff" : "#FFD700"} emissiveIntensity={2} />
          </mesh>
        </Float>
      ))}
    </group>
  )
}

function Landmark({ position, color, label, prosperity }) {
  const mesh = useRef()
  useFrame((state) => {
    if (mesh.current) {
      mesh.current.rotation.y += 0.005 + (prosperity / 10000)
      mesh.current.position.y = 1.2 + Math.sin(state.clock.getElapsedTime()) * 0.15
    }
  })
  return (
    <group position={position} onClick={(e) => e.stopPropagation()}>
      <mesh ref={mesh}>
        <octahedronGeometry args={[1.2]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={prosperity > 60 ? 8 : 2} wireframe={prosperity < 50} transparent opacity={0.8} />
      </mesh>
      <Text position={[0, 3.2, 0]} fontSize={0.7} color={color} outlineWidth={0.08} outlineColor="black">{label}</Text>
      <pointLight color={color} intensity={25} distance={15} />
    </group>
  )
}

function CityEnvironment({ size = 30, prosperity }) {
  const buildings = useMemo(() => {
    const temp = []
    for (let x = -size / 2; x <= size / 2; x += 2) {
      for (let z = -size / 2; z <= size / 2; z += 2) {
        if (Math.abs(x) % 4 !== 0 && Math.abs(z) % 4 !== 0) {
          const pseudoRand = Math.abs(Math.sin(x * 12.9898 + z * 78.233) * 43758.5453) % 1
          if (pseudoRand > 0.4) {
            temp.push({ x, h: 0.5 + pseudoRand * 2.5, z, id: `${x}-${z}` })
          }
        }
      }
    }
    return temp
  }, [size])
  return (
    <group>
      {buildings.map((b) => (
        <mesh key={b.id} position={[b.x, b.h/2, b.z]}>
          <boxGeometry args={[1.6, b.h, 1.6]} />
          <meshStandardMaterial color={prosperity > 70 ? "#1a1a25" : "#111"} transparent opacity={0.6} emissive={prosperity > 80 ? "#006666" : "#000"} emissiveIntensity={0.3} />
        </mesh>
      ))}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]}>
        <planeGeometry args={[size * 4, size * 4]} /><meshStandardMaterial color="#080808" />
      </mesh>
    </group>
  )
}

// ==========================================
// 2. 社會實體組件 (Agent)
// ==========================================

function Agent({ name, state, color, type, onSelect, isFollowed, isHovered }) {
  const mesh = useRef(); const group = useRef(); const bubbleRef = useRef()
  const emotionColor = state.isAngry ? "#FF0000" : state.isHappy ? "#00FF00" : color
  useFrame((state_frame) => {
    if (group.current) { group.current.position.lerp(new THREE.Vector3(...state.pos), 0.1); group.current.position.y = 0.5 }
    if (mesh.current) { 
      mesh.current.rotation.y += (type === 'merchant' ? 0.08 : 0.03)
      mesh.current.scale.setScalar((isFollowed || isHovered ? 1.5 : 1.0) + Math.sin(state_frame.clock.getElapsedTime() * 5) * 0.1) 
    }
    if (bubbleRef.current) { 
      const targetScale = state.thought ? 1 : 0
      bubbleRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, 1), 0.15) 
    }
  })
  return (
    <group ref={group} onClick={(e) => { e.stopPropagation(); onSelect(); }}>
      <pointLight color={emotionColor} intensity={isFollowed || isHovered ? 40 : 15} distance={10} />
      <mesh ref={mesh}>
        {type === 'worker' ? <coneGeometry args={[0.35, 0.6, 32]} /> : type === 'scientist' ? <sphereGeometry args={[0.38, 32, 32]} /> : <boxGeometry args={[0.5, 0.5, 0.5]} />}
        <meshStandardMaterial color={emotionColor} emissive={emotionColor} emissiveIntensity={isFollowed || isHovered ? 40 : 8} />
      </mesh>
      <Text position={[0, 1.3, 0]} fontSize={0.35} color={state.isEarning ? "#00FF00" : emotionColor} outlineWidth={0.06} outlineColor="black">{`${name}\n$${Math.floor(state.wealth)}`}</Text>
      <group ref={bubbleRef} scale={[0, 0, 1]}><Billboard position={[0, 3.5, 0]}><group>
            <mesh position={[0, 0, -0.05]}><planeGeometry args={[3.8, 0.8]} /><meshStandardMaterial color="#000" transparent opacity={0.9} /></mesh>
            <mesh position={[0, -0.5, -0.05]} rotation={[0, 0, Math.PI]}><coneGeometry args={[0.2, 0.3, 3]} /><meshStandardMaterial color="#000" transparent opacity={0.9} /></mesh>
            <mesh position={[0, 0, -0.06]}><planeGeometry args={[3.9, 0.9]} /><meshStandardMaterial color="#00FFFF" emissive="#00FFFF" emissiveIntensity={3} /></mesh>
            <Text fontSize={0.42} color="#00FFFF" anchorX="center" anchorY="middle" outlineWidth={0.02} outlineColor="black">{state.thought}</Text>
      </group></Billboard></group>
      {(isFollowed || isHovered) && (<mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.45, 0]}><ringGeometry args={[0.6, 0.8, 32]} /><meshStandardMaterial color="#00FFFF" emissive="#00FFFF" emissiveIntensity={20} /></mesh>)}
    </group>
  )
}

function WorldController({ isDay, followedPos, prosperity }) {
  const { camera } = useThree()
  const ambientCol = new THREE.Color().lerpColors(new THREE.Color("#222244"), new THREE.Color("#fff5cc"), Math.min(1, prosperity / 150))
  useFrame(() => {
    if (followedPos) {
      const targetPos = new THREE.Vector3(followedPos[0] + 10, 10, followedPos[2] + 10)
      camera.position.lerp(targetPos, 0.08); camera.lookAt(followedPos[0], 0, followedPos[2])
    }
  })
  return (
    <group>
      <color attach="background" args={[isDay ? "#1a4a8c" : "#010103"]} />
      <Sky sunPosition={isDay ? [50, 50, 50] : [0, -100, 0]} turbidity={0.02} rayleigh={isDay ? 0.3 : 4} mieCoefficient={0.005} mieDirectionalG={0.8} />
      <fog attach="fog" args={[isDay ? "#1a4a8c" : "#010103", 20, 150]} />
      <ambientLight intensity={isDay ? 2.5 : 0.3} color={ambientCol} />
      <directionalLight position={[50, 100, 50]} intensity={isDay ? 6 : 0} color="#fff" />
    </group>
  )
}

// ==========================================
// 3. 主應用核心 (Main Application)
// ==========================================

export default function App() {
  const [isDay, setIsDay] = useState(true)
  const [followedId, setFollowedId] = useState(null); const [hoveredId, setHoveredId] = useState(null)
  const [terminalLogs, setTerminalLogs] = useState(["[SYSTEM] OS Ready. Final Calibration."])
  const [agentStates, setAgentStates] = useState([
    { id: 1, name: "商人", type: 'merchant', wealth: 100, pos: [0, 0, 0], color: "#FFD700", isAngry: false, isHappy: false, thought: "", history: ["觀察市場"], isEarning: false },
    { id: 2, name: "工人", type: 'worker', wealth: 50, pos: [4, 0, 8], color: "#00FFFF", isAngry: false, isHappy: false, thought: "", history: ["能源生產"], isEarning: false },
    { id: 3, name: "科學家", type: 'scientist', wealth: 80, pos: [-8, 0, 4], color: "#FF00FF", isAngry: false, isHappy: false, thought: "", history: ["校準觀測"], isEarning: false }
  ])

  const prosperity = useMemo(() => agentStates.reduce((acc, cur) => acc + cur.wealth, 0) / 3, [agentStates])
  const POIs = useMemo(() => [{ id: 'bank', pos: [10, 0, 10], color: '#FFD700', label: '🏦 銀行中心' }, { id: 'factory', pos: [-10, 0, -10], color: '#00FFFF', label: '🏭 能源工廠' }, { id: 'lab', pos: [0, 0, -10], color: '#FF00FF', label: '🧪 粒子實驗室' }], [])
  const logCommand = (cmd) => setTerminalLogs(prev => [cmd, ...prev].slice(0, 8))
  
  // 核心計時器：純數據運算
  useEffect(() => {
    const timer = setInterval(() => {
      setAgentStates(prev => prev.map(a => {
        let newPos = [...a.pos]; let deltaWealth = -0.3; let isEarning = false; let newHistory = [...a.history]
        if (isDay) {
           const myPOI = POIs.find(p => (a.type === 'merchant' && p.id === 'bank') || (a.type === 'worker' && p.id === 'factory') || (a.type === 'scientist' && p.id === 'lab'))
           if (myPOI) {
             newPos[0] = THREE.MathUtils.lerp(newPos[0], myPOI.pos[0], 0.2); newPos[2] = THREE.MathUtils.lerp(newPos[2], myPOI.pos[2], 0.2)
             if (Math.sqrt(Math.pow(newPos[0]-myPOI.pos[0],2) + Math.pow(newPos[2]-myPOI.pos[2],2)) < 2.0) { 
               deltaWealth = 3.5; isEarning = true; if (!a.isEarning) newHistory = ["⚡ 進入地標工作", ...newHistory].slice(0, 4)
             }
           }
        } else if (Math.random() > 0.85) {
           const axis = Math.random() > 0.5 ? 0 : 2; newPos[axis] = THREE.MathUtils.clamp(newPos[axis] + (Math.random() > 0.5 ? 4 : -4), -14, 14)
        }
        return { ...a, pos: newPos, wealth: Math.max(0, a.wealth + deltaWealth), isHappy: (a.isHappy && isDay) || isEarning, isEarning, history: newHistory }
      }))
    }, 1000); return () => clearInterval(timer)
  }, [POIs, isDay])

  // 獨立的想法產生器：解決狀態衝突
  useEffect(() => {
    const thoughtTimer = setInterval(() => {
      if (Math.random() > 0.7) {
        const targetIdx = Math.floor(Math.random() * 3)
        const thoughts = ["這城市真美", "工作好累...", "數據連動中", "想喝杯咖啡", "掌控數據模型"]
        const t = thoughts[Math.floor(Math.random() * thoughts.length)]
        setAgentStates(prev => prev.map((a, i) => i === targetIdx ? { ...a, thought: t, history: [`內心獨白：${t}`, ...a.history].slice(0, 4) } : a))
        logCommand(`廣播想法 [${agentStates[targetIdx].name}] -> "${t}"`)
        setTimeout(() => setAgentStates(prev => prev.map((a, i) => i === targetIdx ? { ...a, thought: "" } : a)), 5000)
      }
    }, 8000); return () => clearInterval(thoughtTimer)
  }, [agentStates])

  const followedAgent = agentStates.find(a => a.id === followedId)
  const panelStyle = { background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: '16px', boxShadow: '0 10px 30px rgba(0,0,0,0.3)' }

  return (
    <div style={{ width: '100vw', height: '100vh', overflow: 'hidden', background: '#000' }}>
      <div style={{ position: 'absolute', top: 20, left: '50%', transform: 'translateX(-50%)', zIndex: 100, display: 'flex', gap: '20px', alignItems: 'center' }}>
        <button onClick={() => setIsDay(!isDay)} style={{ ...panelStyle, padding: '10px 25px', borderRadius: '50px', cursor: 'pointer', fontWeight: 'bold', border: `2px solid ${isDay ? 'rgba(0,255,255,0.5)' : '#FFD700'}` }}>{isDay ? '🌙 轉為深夜' : '☀️ 轉為白晝'}</button>
        <div style={{ ...panelStyle, padding: '12px 50px', textAlign: 'center', minWidth: '350px' }}>
          <h2 style={{ margin: 0, color: isDay ? '#00FFFF' : '#FFD700', fontSize: '1.4rem', fontWeight: 'bold' }}>{isDay ? '☀️ 白晝時刻' : '🌙 深夜時刻'}</h2>
          <div style={{ width: '100%', background: 'rgba(255,255,255,0.1)', height: '6px', marginTop: '12px', borderRadius: '3px', overflow: 'hidden' }}><div style={{ width: `${Math.min(prosperity, 100)}%`, background: '#0f0', height: '100%', transition: 'width 1.5s' }}></div></div>
          <small style={{ color: 'rgba(255,255,255,0.6)', fontWeight: 'bold' }}>城市繁榮度：{Math.floor(prosperity)}%</small>
        </div>
      </div>
      <div style={{ position: 'absolute', top: 30, left: 30, zIndex: 10, pointerEvents: 'none' }}>
        <h1 style={{ margin: 0, color: '#FFD700', letterSpacing: '8px', fontSize: '2.5rem', textShadow: '2px 2px 12px rgba(0,0,0,1)' }}>AI 代理人城市</h1>
        <div style={{ ...panelStyle, padding: '25px', marginTop: '20px', borderLeft: '6px solid #00FFFF', pointerEvents: 'auto', width: '400px' }}>
           <h4 style={{ margin: '0 0 15px 0', color: '#00FFFF', fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '10px' }}><span>🏙️</span> 城市戰略指揮指南</h4>
           <div style={{ marginBottom: '15px' }}>
             <p style={{ margin: '0 0 5px 0', color: '#FFD700', fontSize: '0.9rem', fontWeight: 'bold' }}>🛰️ 空間感知與追蹤</p>
             <ul style={{ listStyle: 'none', margin: 0, padding: 0, fontSize: '0.85rem', color: 'rgba(255,255,255,0.85)', lineHeight: '1.7' }}>
               <li>• <b>鎖定追蹤</b>：點擊右側 Agent 卡片或 3D 小人進入特寫</li>
               <li>• <b>懸浮高亮</b>：滑鼠滑過清單，對應小人會發光並變大</li>
               <li>• <b>自由觀察</b>：點擊空地返回上帝視角，右鍵旋轉/滾輪縮放</li>
             </ul>
           </div>
           <div style={{ marginBottom: '15px' }}>
             <p style={{ margin: '0 0 5px 0', color: '#FFD700', fontSize: '0.9rem', fontWeight: 'bold' }}>🧬 社會演化與回饋</p>
             <ul style={{ listStyle: 'none', margin: 0, padding: 0, fontSize: '0.85rem', color: 'rgba(255,255,255,0.85)', lineHeight: '1.7' }}>
               <li>• <b>資源收益</b>：白天前往地標工作，數字變 <span style={{color:'#0f0'}}>綠色</span> 即獲益</li>
               <li>• <b>地標進化</b>：繁榮度越高，地標建築會由虛擬線框轉為實體</li>
               <li>• <b>內心獨白</b>：觀察氣泡讀取 Agent 想法，補助可提振心情</li>
             </ul>
           </div>
           <div>
             <p style={{ margin: '0 0 5px 0', color: '#FFD700', fontSize: '0.9rem', fontWeight: 'bold' }}>🖥️ 底層數據核心 (Virtual Redis)</p>
             <ul style={{ listStyle: 'none', margin: 0, padding: 0, fontSize: '0.85rem', color: 'rgba(255,255,255,0.85)', lineHeight: '1.7' }}>
               <li>• <b>指令鏡像</b>：底部終端即時同步 Agent 的行為數據指令</li>
               <li>• <b>生命軌跡</b>：右側面板詳實記錄代理人的所有歷史事件</li>
             </ul>
           </div>
        </div>
      </div>
      <div style={{ position: 'absolute', bottom: 20, left: '50%', transform: 'translateX(-50%)', zIndex: 100, width: '600px' }}>
        <div style={{ ...panelStyle, background: 'rgba(0,10,20,0.6)', padding: '15px', border: '1px solid rgba(0,255,255,0.3)', fontFamily: 'monospace', fontSize: '0.75rem', color: '#00FF00' }}>
          <div style={{ color: '#00FFFF', marginBottom: '5px', borderBottom: '1px solid rgba(0,68,68,0.3)' }}>REDIS_SHADOW_TERMINAL v1.2</div>
          {terminalLogs.map((log, i) => <div key={i} style={{ opacity: 1 - i * 0.1 }}>{`> ${log}`}</div>)}
        </div>
      </div>
      <div style={{ position: 'absolute', top: 30, right: 30, zIndex: 100, display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div style={{ ...panelStyle, padding: '20px', width: '260px' }}>
          <h4 style={{ color: '#FFD700', margin: '0 0 15px 0', fontSize: '1rem', textAlign: 'center' }}>👥 代理人生命軌跡</h4>
          {agentStates.map(a => (
            <div key={a.id} onClick={(e) => { e.stopPropagation(); setFollowedId(prev => prev === a.id ? null : a.id); }}
              style={{ padding: '12px', marginBottom: '12px', borderRadius: '10px', cursor: 'pointer', background: followedId === a.id ? 'rgba(0,255,255,0.2)' : 'rgba(255,255,255,0.05)', border: `1px solid ${followedId === a.id ? '#00FFFF' : 'transparent'}` }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: a.color, fontWeight: 'bold' }}>{a.name}</span><span>${Math.floor(a.wealth)}</span></div>
              <div style={{ marginTop: '8px', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '5px' }}>
                  {a.history.map((h, i) => <div key={i} style={{ color: h.includes('⚡') ? '#0ff' : 'rgba(255,255,255,0.5)', fontSize: '0.7rem' }}>• {h}</div>)}
              </div>
            </div>
          ))}
        </div>
        <button onClick={(e) => { e.stopPropagation(); setAgentStates(p => p.map(a => ({ ...a, wealth: a.wealth + 85, isHappy: true, thought: "上帝顯靈！" }))); setTimeout(() => setAgentStates(p => p.map(a => ({ ...a, isHappy: false, thought: "" }))), 5000) }} 
          style={{ ...panelStyle, background: 'rgba(0,255,0,0.2)', color: '#0f0', border: '1px solid rgba(0,255,0,0.4)', padding: '15px', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold' }}>💰 全城補助</button>
        <button onClick={(e) => { e.stopPropagation(); setAgentStates(p => p.map(a => ({ ...a, wealth: a.wealth * 0.55, isAngry: true, thought: "重稅降臨..." }))); setTimeout(() => setAgentStates(p => p.map(a => ({ ...a, isAngry: false, thought: "" }))), 5000) }} 
          style={{ ...panelStyle, background: 'rgba(255,0,0,0.2)', color: '#f55', border: '1px solid rgba(255,0,0,0.4)', padding: '15px', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold' }}>⚖️ 徵收重稅</button>
      </div>
      <Canvas camera={{ position: [25, 25, 25], fov: 45 }} shadows onPointerMissed={() => setFollowedId(null)}>
        <WorldController isDay={isDay} followedPos={followedAgent?.pos} prosperity={prosperity} />
        <group visible={!isDay}><Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} /></group>
        <DataMotes isDay={isDay} />
        {isDay && <group><Cloud position={[-15, 18, -15]} speed={0.2} opacity={0.6} /><Cloud position={[15, 20, 15]} speed={0.2} opacity={0.6} /><Cloud position={[0, 22, 0]} speed={0.1} opacity={0.4} /></group>}
        <Landmark position={[10, 0, 10]} color="#FFD700" label="🏦 銀行中心" prosperity={prosperity} />
        <Landmark position={[-10, 0, -10]} color="#00FFFF" label="🏭 能源工廠" prosperity={prosperity} />
        <Landmark position={[0, 0, -10]} color="#FF00FF" label="🧪 粒子實驗室" prosperity={prosperity} />
        <CityEnvironment size={30} prosperity={prosperity} />
        {agentStates.map(agent => (
          <Agent key={agent.id} name={agent.name} type={agent.type} state={agent} color={agent.color} onSelect={() => setFollowedId(agent.id)} isFollowed={followedId === agent.id} isHovered={hoveredId === agent.id} />
        ))}
        {!followedId && <OrbitControls makeDefault maxPolarAngle={Math.PI / 2.1} minDistance={10} maxDistance={80} />}
      </Canvas>
    </div>
  )
}
