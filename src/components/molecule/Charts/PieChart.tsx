import { useTheme } from '@/theme/ThemeContext';
import { DefaultizedPieValueType } from '@mui/x-charts';
import { legendClasses } from '@mui/x-charts/ChartsLegend';
import { PieChart, PieChartProps } from '@mui/x-charts/PieChart';

const data = [
    { category: 'Vegetables', orders: 31 },
    { category: 'Fruits', orders: 50 },
    { category: 'Snacks', orders: 18 },
    { category: 'Beverages', orders: 37 },
    { category: 'Essentials', orders: 6 },
];

export type LocalPieChartProps = {
    data: {
        category: string;
        orders: number;
    }[];
    width?: number;
    height?: number;
    title?: string;
}

export default function LocalPieChart({ data, width, height, title }: LocalPieChartProps) {
    const { theme } = useTheme();
    
    const sizing = {
        margin: { right: 5 },
        width: width || 200,
        height: height || 200,
        // Remove hideLegend: true to show the legend
    };

    const TOTAL = data.map((item) => item.orders).reduce((a, b) => a + b, 0);

    const getArcLabel = (params: DefaultizedPieValueType) => {
        const percent = params.value / TOTAL;
        return `${(percent * 100).toFixed(0)}%`;
    };

    const otherProps: Partial<PieChartProps> = {
        width: 200,
        height: 200,
        sx: {
            [`.${legendClasses.root}`]: {
                transform: 'translate(20px, 0)',
            },
            [`.${legendClasses.root} text`]: {
                fill: theme === 'light' ? '#000' : '#fff',
            },
            // More specific selectors to ensure legend text is targeted
            [`.${legendClasses.series} text`]: {
                fill: theme === 'light' ? '#000' : '#fff',
            },
            [`.${legendClasses.mark} + text`]: {
                fill: theme === 'light' ? '#000' : '#fff',
            },
            // Target all text elements within the legend
            [`& .${legendClasses.root} *`]: {
                color: theme === 'light' ? '#000' : '#fff',
            },
        },
    };

    return (
        <div>
            {title && <h3>{title}</h3>}
            <PieChart
                series={[
                    {
                        arcLabel: getArcLabel,
                        arcLabelMinAngle: 45,
                        data: data.map((d) => ({ label: d.category, id: d.category, value: d.orders })),
                        valueFormatter: (v, { dataIndex }) => {
                            return `${v.value} products sold.`;
                        },
                    },
                ]}
                {...otherProps}
                {...sizing}
                style={{
                    flexDirection: 'column',
                }}
                className='text-body-custom'
                width={width || 500}
                height={height || 500}
                fontSize={'14px'}
                colors={['#F66D44', '#FEAE65', '#E6F69D', '#AADEA7', '#2D87BB']}
            />
        </div>
    );
}