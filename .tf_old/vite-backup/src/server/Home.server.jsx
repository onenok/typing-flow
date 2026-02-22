import React from 'react'

export default function Home() {
  // 這是伺服器端組件
  // 可以在這裡直接存取資料庫或後端資源
  const serverData = {
    message: 'Hello from Server Component!',
    timestamp: new Date().toISOString()
  }

  return (
    <div>
      <h1>React Server Component</h1>
      <p>訊息: {serverData.message}</p>
      <p>時間: {serverData.timestamp}</p>
    </div>
  )
}