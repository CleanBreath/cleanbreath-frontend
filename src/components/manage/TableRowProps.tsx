interface TableRowProps {
    id: number;
    checked: boolean;
    index: number;
    title: string;
    date: string;
    onCkeckChange: (id: number) => void;
}

export default function TableRow({ id, checked, index, title, date, onCkeckChange }: TableRowProps) {
    return (
        <tr key={id}>
            <td>
                <input type="checkbox" checked={checked} onChange={() => onCkeckChange(id)} />
            </td>
            <td>{index + 1}</td>
            <td>{title}</td>
            <td>{date.substring(0, 10)}</td>
        </tr>
    )
}