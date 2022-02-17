// 🚹 Player
// 🟢 Empty
// 📦 Box
// ❌ Box on goal
// ⭕ Goal
// 🔴 Character on goal
// 🧱 Wall
// ⚫ Background

const levels = [
    [
        ['🧱', '🧱', '🧱', '🧱', '🧱', '🧱', '🧱', '🧱', '🧱', '🧱'],
        ['🧱', '🧱', '🟢', '🟢', '🧱', '⭕', '🟢', '🧱', '🧱', '🧱'],
        ['🧱', '🟢', '🟢', '🟢', '🟢', '🟢', '🟢', '🧱', '🧱', '🧱'],
        ['🧱', '🟢', '🚹', '🧱', '🧱', '🟢', '🧱', '🧱', '🧱', '🧱'],
        ['🧱', '🧱', '🟢', '🟢', '🟢', '📦', '🟢', '🟢', '🟢', '🧱'],
        ['🧱', '🧱', '🟢', '🟢', '🧱', '🧱', '🟢', '🟢', '🟢', '🧱'],
        ['🧱', '🧱', '🧱', '🧱', '🧱', '🧱', '🧱', '🧱', '🧱', '🧱'],
    ],
    [
        ['🧱', '🧱', '🧱', '🧱', '🧱', '🧱', '🧱', '🧱'],
        ['🧱', '🟢', '🟢', '🧱', '🧱', '🧱', '🧱', '🧱'],
        ['🧱', '🚹', '🟢', '🟢', '🟢', '🧱', '🧱', '🧱'],
        ['🧱', '🟢', '⭕', '📦', '🟢', '📦', '🟢', '🧱'],
        ['🧱', '🧱', '📦', '🧱', '⭕', '🟢', '🟢', '🧱'],
        ['🧱', '🟢', '🟢', '🧱', '🧱', '🧱', '🧱', '🧱'],
        ['🧱', '🟢', '🟢', '🟢', '🟢', '🟢', '⭕', '🧱'],
        ['🧱', '🟢', '🟢', '🟢', '🟢', '🟢', '🟢', '🧱'],
        ['🧱', '🧱', '🧱', '🧱', '🧱', '🧱', '🧱', '🧱'],
    ],
    [
        ['⚫', '⚫', '🧱', '🧱', '🧱', '🧱', '🧱', '🧱', '🧱', '🧱', '⚫', '⚫', '⚫'],
        ['⚫', '🧱', '🧱', '⭕', '🟢', '🟢', '🟢', '🟢', '🟢', '🟢', '🧱', '⚫', '⚫'],
        ['⚫', '🧱', '🧱', '🧱', '🧱', '🟢', '🧱', '🧱', '🧱', '🟢', '🧱', '🧱', '⚫'],
        ['⚫', '🧱', '🟢', '🟢', '🟢', '🟢', '🟢', '🟢', '🟢', '🚹', '🧱', '🧱', '🧱'],
        ['⚫', '🧱', '🟢', '🧱', '🧱', '📦', '🧱', '🧱', '🟢', '🧱', '🧱', '🧱', '🧱'],
        ['⚫', '🧱', '🟢', '📦', '🟢', '⭕', '🟢', '🧱', '❌', '🟢', '🟢', '🟢', '🧱'],
        ['🧱', '🧱', '🟢', '🧱', '🟢', '🧱', '🟢', '🧱', '🟢', '🧱', '📦', '🟢', '🧱'],
        ['🧱', '⭕', '🟢', '🟢', '❌', '🟢', '🟢', '🟢', '⭕', '🟢', '📦', '🟢', '🧱'],
        ['🧱', '🧱', '🧱', '🧱', '🧱', '🧱', '🧱', '🧱', '🧱', '🧱', '🧱', '🧱', '🧱'],
    ]
]

export default levels;