import React from 'react'

function Container({ children }: { children: React.ReactNode }) {
  return (
    <main className="max-w-[1600px] mx-auto px-4 py-8">
      {children}
    </main>
  )
}

export { Container as default }
export { Container }