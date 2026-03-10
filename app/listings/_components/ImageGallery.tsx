'use client'

import { useState } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight, X, ImageIcon } from 'lucide-react'

export function ImageGallery({ photos, address }: { photos: string[], address?: string }) {
    const [currentIndex, setCurrentIndex] = useState(0)
    const [isFullscreen, setIsFullscreen] = useState(false)

    if (!photos || photos.length === 0) {
        return (
            <div className="w-full h-[400px] bg-gray-100 flex items-center justify-center rounded-lg">
                <span className="text-gray-400">No images available</span>
            </div>
        )
    }

    const handleNext = () => setCurrentIndex((prev) => (prev + 1) % photos.length)
    const handlePrev = () => setCurrentIndex((prev) => (prev - 1 + photos.length) % photos.length)

    const openFullscreen = (index: number) => {
        setCurrentIndex(index)
        setIsFullscreen(true)
    }

    const remainingCount = photos.length - 3

    return (
        <>
            {/* Photo Grid: 1 large left + 2 stacked right */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-1.5 rounded-lg overflow-hidden h-[300px] md:h-[480px]">
                {/* Main large photo */}
                <button
                    className="relative md:col-span-2 h-full cursor-pointer group overflow-hidden"
                    onClick={() => openFullscreen(0)}
                >
                    <Image
                        src={photos[0]}
                        alt={address ? `${address} - Photo 1` : 'Property photo 1'}
                        fill
                        className="object-cover group-hover:brightness-95 transition-all duration-200"
                        sizes="(max-width: 768px) 100vw, 66vw"
                        priority
                    />
                </button>

                {/* Right column — 2 stacked photos */}
                <div className="hidden md:grid grid-rows-2 gap-1.5 h-full">
                    {photos[1] ? (
                        <button
                            className="relative h-full cursor-pointer group overflow-hidden"
                            onClick={() => openFullscreen(1)}
                        >
                            <Image
                                src={photos[1]}
                                alt={address ? `${address} - Photo 2` : 'Property photo 2'}
                                fill
                                className="object-cover group-hover:brightness-95 transition-all duration-200"
                                sizes="33vw"
                            />
                        </button>
                    ) : (
                        <div className="bg-gray-100" />
                    )}
                    {photos[2] ? (
                        <button
                            className="relative h-full cursor-pointer group overflow-hidden"
                            onClick={() => openFullscreen(2)}
                        >
                            <Image
                                src={photos[2]}
                                alt={address ? `${address} - Photo 3` : 'Property photo 3'}
                                fill
                                className="object-cover group-hover:brightness-95 transition-all duration-200"
                                sizes="33vw"
                            />
                            {remainingCount > 0 && (
                                <div className="absolute inset-0 bg-black/50 flex items-center justify-center transition-colors group-hover:bg-black/40">
                                    <span className="flex items-center gap-2 text-white font-semibold text-base">
                                        <ImageIcon className="w-5 h-5" />
                                        + {remainingCount}
                                    </span>
                                </div>
                            )}
                        </button>
                    ) : (
                        <div className="bg-gray-100" />
                    )}
                </div>
            </div>

            {/* Fullscreen Lightbox */}
            {isFullscreen && (
                <div className="fixed inset-0 z-[100] bg-black/95 flex flex-col items-center justify-center">
                    <button
                        onClick={() => setIsFullscreen(false)}
                        className="absolute top-5 right-5 text-white/70 hover:text-white p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors z-50"
                    >
                        <X className="w-6 h-6" />
                    </button>

                    <div className="absolute top-5 left-1/2 -translate-x-1/2 text-white/60 text-sm font-medium">
                        {currentIndex + 1} / {photos.length}
                    </div>

                    <div className="relative w-full h-[80vh] flex items-center justify-center">
                        <Image
                            src={photos[currentIndex]}
                            alt={address ? `${address} - Photo ${currentIndex + 1}` : `Property photo ${currentIndex + 1}`}
                            fill
                            className="object-contain"
                            sizes="100vw"
                        />

                        {photos.length > 1 && (
                            <>
                                <button
                                    onClick={handlePrev}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white p-3 rounded-full transition-all z-50"
                                >
                                    <ChevronLeft className="w-6 h-6" />
                                </button>
                                <button
                                    onClick={handleNext}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white p-3 rounded-full transition-all z-50"
                                >
                                    <ChevronRight className="w-6 h-6" />
                                </button>
                            </>
                        )}
                    </div>

                    {/* Thumbnail strip */}
                    <div className="flex gap-2 mt-4 overflow-x-auto max-w-[90vw] pb-2">
                        {photos.map((photo, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentIndex(index)}
                                className={`relative flex-shrink-0 w-16 h-16 rounded overflow-hidden border-2 transition-all ${index === currentIndex ? 'border-white opacity-100' : 'border-transparent opacity-50 hover:opacity-80'}`}
                            >
                                <Image
                                    src={photo}
                                    alt={address ? `${address} - Thumbnail ${index + 1}` : `Thumbnail ${index + 1}`}
                                    fill
                                    className="object-cover"
                                    sizes="64px"
                                />
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </>
    )
}
