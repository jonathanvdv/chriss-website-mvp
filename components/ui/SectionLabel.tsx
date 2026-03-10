export function SectionLabel({ text, className = '' }: { text: string, className?: string }) {
    return (
        <h3 className={`text-brand-accent tracking-[0.2em] text-xs font-semibold uppercase mb-4 ${className}`}>
            {text}
        </h3>
    )
}
