import React from 'react'
import { MapPin, Hammer, ArrowRight, Globe, Heart, Award } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Artisans() {
  const artisans = [
    {
      id: 1,
      name: "Elara Vance",
      location: "Cusco, Peru",
      craft: "Textile Weaving",
      bio: "Using techniques passed down for 500 years, Elara dyes wool using local insects and plants to create vibrant, sustainable tapestries.",
      img: "https://images.unsplash.com/photo-1590735213920-68192a487c63?q=80&w=800&auto=format&fit=crop",
      specialty: "Alpaca Wool"
    },
    {
      id: 2,
      name: "Koji Tanaka",
      location: "Kyoto, Japan",
      craft: "Ceramics (Raku)",
      bio: "Koji believes that imperfection is the highest form of beauty. His tea sets are fired in a hand-built kiln in the mountains.",
      img: "https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?q=80&w=800&auto=format&fit=crop",
      specialty: "Tea Sets"
    },
    {
      id: 3,
      name: "Amara Diop",
      location: "Dakar, Senegal",
      craft: "Jewelry Making",
      bio: "Amara transforms recycled brass and silver into modern heirlooms inspired by the geometry of West African architecture.",
      img: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?q=80&w=800&auto=format&fit=crop",
      specialty: "Brass Work"
    },
    {
      id: 4,
      name: "Elena Rossi",
      location: "Florence, Italy",
      craft: "Leather Binding",
      bio: "Keeping the Renaissance tradition alive, Elena hand-stitches leather journals using tools inherited from her grandfather.",
      img: "https://images.unsplash.com/photo-1506815449277-2268ee7f23e6?q=80&w=800&auto=format&fit=crop",
      specialty: "Bookbinding"
    }
  ]

  return (
    <div className="min-h-screen bg-stone-50 font-sans text-stone-800">
      
      {/* Hero */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1605218427306-022ba6c1bc94?q=80&w=2000&auto=format&fit=crop" 
          alt="Hands working clay" 
          className="absolute inset-0 w-full h-full object-cover grayscale brightness-[0.4]"
        />
        <div className="relative z-10 text-center text-stone-100 max-w-3xl px-6">
          <h1 className="font-serif text-5xl md:text-7xl mb-6">Guardians of Heritage</h1>
          <p className="text-xl md:text-2xl font-light text-stone-300 leading-relaxed">
            Every imperfection tells a story. Meet the master craftsmen and women keeping ancient traditions alive in a modern world.
          </p>
        </div>
      </section>

      {/* Directory Grid */}
      <section className="bg-stone-100 py-24 px-6">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {artisans.map(artisan => (
              <div key={artisan.id} className="bg-white p-6 shadow-sm">
                <img src={artisan.img} alt={artisan.name} className="w-full h-48 object-cover mb-4 grayscale hover:grayscale-0 transition-all" />
                <h3 className="font-serif text-xl">{artisan.name}</h3>
                <p className="text-sm text-stone-500">{artisan.location}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}