'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface PaginationProps {
    currentPage: number
    totalPages: number
}

/**
 * Pagination Component
 * 
 * Renders a set of page numbers and navigation arrows forpaginating listing results.
 * Integrates with Next.js navigation by updating the 'page' URL search parameter.
 */
export function Pagination({ currentPage, totalPages }: PaginationProps) {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()

    if (totalPages <= 1) return null

    const goToPage = (page: number) => {
        const params = new URLSearchParams(searchParams.toString())
        if (page <= 1) {
            params.delete('page')
        } else {
            params.set('page', page.toString())
        }
        router.push(pathname + '?' + params.toString())
    }

    // Build page numbers to show
    const pages: (number | 'ellipsis')[] = []
    const maxVisible = 7
    if (totalPages <= maxVisible) {
        for (let i = 1; i <= totalPages; i++) pages.push(i)
    } else {
        pages.push(1)
        const start = Math.max(2, currentPage - 1)
        const end = Math.min(totalPages - 1, currentPage + 1)
        if (start > 2) pages.push('ellipsis')
        for (let i = start; i <= end; i++) pages.push(i)
        if (end < totalPages - 1) pages.push('ellipsis')
        pages.push(totalPages)
    }

    const btnBase = 'inline-flex items-center justify-center min-w-[36px] h-9 px-2 text-sm rounded border transition-colors'
    const btnActive = 'bg-brand-accent text-white border-brand-accent'
    const btnInactive = 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'

    return (
        <nav className="flex items-center justify-center gap-1.5 mt-10" aria-label="Pagination">
            <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage <= 1}
                className={`${btnBase} ${currentPage <= 1 ? 'opacity-40 cursor-not-allowed border-gray-200' : btnInactive}`}
            >
                <ChevronLeft className="w-4 h-4" />
            </button>

            {pages.map((p, i) =>
                p === 'ellipsis' ? (
                    <span key={`e${i}`} className="px-1 text-gray-400">...</span>
                ) : (
                    <button
                        key={p}
                        onClick={() => goToPage(p)}
                        className={`${btnBase} ${p === currentPage ? btnActive : btnInactive}`}
                    >
                        {p}
                    </button>
                )
            )}

            <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage >= totalPages}
                className={`${btnBase} ${currentPage >= totalPages ? 'opacity-40 cursor-not-allowed border-gray-200' : btnInactive}`}
            >
                <ChevronRight className="w-4 h-4" />
            </button>
        </nav>
    )
}
