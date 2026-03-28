// ─── Icons ────────────────────────────────────────────────────────────────────
const Icon = ({
    d,
    s = 16,
    stroke = "currentColor",
    fill = "none",
    sw = 2,
}) => (
    <svg
        width={s}
        height={s}
        viewBox="0 0 24 24"
        fill={fill}
        stroke={stroke}
        strokeWidth={sw}
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        {Array.isArray(d) ? (
            d.map((p, i) => <path key={i} d={p} />)
        ) : (
            <path d={d} />
        )}
    </svg>
);

export const ClockIcon = ({ s = 16 }) => (
    <Icon
        s={s}
        d={["M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z", "M12 6v6l4 2"]}
    />
);

export const ArrowRight = ({ s = 16 }) => (
    <Icon s={s} d="M5 12h14M12 5l7 7-7 7" />
);

export const RefreshIcon = ({ s = 16 }) => (
    <Icon
        s={s}
        d="M23 4v6h-6M1 20v-6h6M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"
    />
);

export const CalIcon = ({ s = 16 }) => (
    <Icon
        s={s}
        d={[
            "M8 2v4M16 2v4",
            "M3 8h18",
            "M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z",
        ]}
    />
);

export const ChevronDown = ({ s = 16 }) => <Icon s={s} d="M6 9l6 6 6-6" />;
export const ChevronLeft = ({ s = 16 }) => <Icon s={s} d="M15 18l-6-6 6-6" />;
export const ChevronRight = ({ s = 16 }) => <Icon s={s} d="M9 18l6-6-6-6" />;
export const PlusIcon = ({ s = 16 }) => <Icon s={s} d="M12 5v14M5 12h14" />;
export const MinusIcon = ({ s = 16 }) => <Icon s={s} d="M5 12h14" />;
export const XIcon = ({ s = 16 }) => <Icon s={s} d="M18 6L6 18M6 6l12 12" />;
export const CheckIcon = ({ s = 16 }) => <Icon s={s} d="M20 6L9 17l-5-5" />;

export const StarIcon = ({ s = 16 }) => (
    <Icon
        s={s}
        d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
        fill="currentColor"
        stroke="none"
    />
);

export const ShieldIcon = ({ s = 16 }) => (
    <Icon s={s} d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
);

export const HeadphonesIcon = ({ s = 16 }) => (
    <Icon
        s={s}
        d={[
            "M3 18v-6a9 9 0 0 1 18 0v6",
            "M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z",
        ]}
    />
);

export const GripIcon = ({ s = 16 }) => (
    <Icon
        s={s}
        d={["M9 5h.01M9 12h.01M9 19h.01M15 5h.01M15 12h.01M15 19h.01"]}
        sw={2.5}
    />
);

export const EditIcon = ({ s = 16 }) => (
    <Icon
        s={s}
        d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"
    />
);

export const BusIcon = ({ s = 16 }) => (
    <Icon
        s={s}
        d={[
            "M8 6v6M16 6v6M3 6h18v11a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6z",
            "M3 6V4a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1v2",
            "M7 17v2M17 17v2",
        ]}
    />
);

export const MapPinIcon = ({ s = 16 }) => (
    <Icon
        s={s}
        d={[
            "M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z",
            "M12 10m-3 0a3 3 0 1 0 6 0 3 3 0 1 0-6 0",
        ]}
    />
);

export const AlertIcon = ({ s = 16 }) => (
    <Icon
        s={s}
        d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0zM12 9v4M12 17h.01"
    />
);
