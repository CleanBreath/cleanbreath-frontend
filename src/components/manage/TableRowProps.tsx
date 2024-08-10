interface TableRowProps {
    id: number;
    checked: boolean;
    index: number;
    title: string;
    date: string;
    onCheckChange: (id: number) => void;
    onClickDetails: (id: number) => void;
}

export default function TableRow({ id, checked, index, title, date, onCheckChange, onClickDetails }: TableRowProps) {
    return (
        <>
            <tr key={id} onClick={() => onClickDetails(id)}>
                <td>
                    <input type="checkbox" checked={checked} onChange={() => onCheckChange(id)} />
                </td>
                <td>{index + 1}</td>
                <td>{title}</td>
                <td>{date.substring(0, 10)}</td>
            </tr>
        </>
    )
}