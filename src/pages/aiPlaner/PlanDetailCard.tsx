export default function PlanDetailCard({ title, activity, description }: any) {
    return (
        <div className="p-4 border rounded-lg">
            <p className="font-bold text-primary">{title}</p>
            <h5 className="font-semibold mt-1">{activity}</h5>
            <p className="text-sm text-muted-foreground mt-1">{description}</p>
        </div>
    )
}