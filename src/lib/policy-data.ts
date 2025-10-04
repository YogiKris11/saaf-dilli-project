
export const POLICIES_DATA = [
    {
        id: 'winter-plan',
        title: 'Winter Action Plan',
        chartTitle: 'Reduction in Severe Air Pollution Days (Winter)',
        chartDescription: 'Comparison of "Severe" AQI days during winter before and after implementation of focused action plans.',
        yAxisLabel: 'Number of "Severe" Days',
        chartData: [
            { period: '2016 (Before)', value: 26, fill: 'hsl(0 0% 0%)' },
            { period: '2022 (After)', value: 6, fill: 'hsl(var(--primary))' },
        ],
        notes: [
            "Data primarily reflects a reduction in days with 'Severe' AQI readings during the winter season.",
            "Government reports also indicate a ~30% reduction in overall pollution levels during this period.",
            "Meteorological conditions like wind and rain play a significant role and can affect year-to-year results.",
            "Despite improvements, many 'Very Poor' days still occur during winter."
        ]
    },
    {
        id: 'summer-plan',
        title: 'Summer Action Plan',
        chartTitle: 'Reduction in "Very Poor to Severe" Days (Summer)',
        chartDescription: 'Comparison of days in "Very Poor to Severe" categories during summer months between 2016 and 2022.',
        yAxisLabel: 'Number of Days',
        chartData: [
            { period: '2016 (Before)', value: 124, fill: 'hsl(0 0% 0%)' },
            { period: '2022 (After)', value: 72, fill: 'hsl(var(--primary))' },
        ],
        notes: [
            "This initiative focuses on controlling dust, open burning, and industrial emissions during drier months.",
            "Officials claimed a ~30% reduction in pollution in summer 2022 compared to 2016.",
            "Improvements are more noticeable in summer, as winter challenges like stubble burning present a greater obstacle."
        ]
    },
    {
        id: 'general-trends',
        title: 'General Trends',
        chartTitle: 'Increase in Green Cover',
        chartDescription: 'Change in Delhi\'s green cover as a percentage of its total area, a key long-term goal of action plans.',
        yAxisLabel: 'Green Cover (%)',
        chartData: [
            { period: '2015', value: 20.2, fill: 'hsl(0 0% 0%)' },
            { period: '2021', value: 23.06, fill: 'hsl(var(--primary))' },
        ],
        notes: [
            "Regulatory measures include bans on older vehicles, stricter enforcement on construction dust, and penalties for open burning.",
            "There is an increased number of enforcement teams for environmental compliance."
        ]
    }
];
