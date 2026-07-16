function refreshStreakUI(streak) {
    if (!streak) {
        return;
    }

    const streakCount = document.getElementById("streakCount");
    const bestStreak = document.getElementById("bestStreak");
    const todayStatus = document.getElementById("todayStatus");

    if (!streakCount || !bestStreak || !todayStatus) {
        return;
    }

    streakCount.textContent = streak.current_streak;
    bestStreak.textContent = `${streak.best_streak} Days`;

    const today = new Date();
    const todayString = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

    todayStatus.classList.remove("completed", "not-completed");

    if (streak.last_activity_date === todayString) {
        todayStatus.textContent = "✔ Completed Today";
        todayStatus.classList.add("completed");
    } else {
        todayStatus.textContent = "❌ Not Completed";
        todayStatus.classList.add("not-completed");
    }
}

async function getCurrentUser() {
    const {
        data: { user },
        error
    } = await supabase.auth.getUser();

    if (error) {
        console.error("Supabase auth error while getting current user:", error);
        return null;
    }

    console.log("Current authenticated user:", user || "none");

    if (!user) {
        console.warn("No authenticated user found. Skipping streak update.");
        return null;
    }

    return user;
}

async function getUserStreak() {
    const user = await getCurrentUser();

    if (!user) {
        return null;
    }

    console.log("Fetching streak for user:", user.id);

    const { data, error } = await supabase
        .from("user_streaks")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

    if (error) {
        console.error("Supabase error while fetching user streak:", error);
        return null;
    }

    if (data === null) {
        const newStreakRow = {
            user_id: user.id,
            current_streak: 0,
            best_streak: 0,
            last_activity_date: null
        };

        console.log("Creating streak row:", newStreakRow);

        const { data: created, error: insertError } = await supabase
            .from("user_streaks")
            .insert(newStreakRow)
            .select()
            .maybeSingle();

        if (insertError) {
            console.error("Insert streak row failure:", insertError);
            return null;
        }

        console.log("Insert streak row success:", created);
        return created;
    }

    console.log("Existing streak data:", data);
    return data;
}

async function updateStreak() {
    const streak = await getUserStreak();

    if (!streak) {
        return null;
    }

    const today = new Date();
    const todayString = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

    console.log("Updating streak for today:", todayString);
    console.log("Existing streak data:", streak);

    if (streak.last_activity_date === todayString) {
        console.log("Streak already updated today. No change needed.");
        refreshStreakUI(streak);
        return streak;
    }

    let newStreak = 1;

    if (streak.last_activity_date) {
        const last = new Date(streak.last_activity_date);
        const diff = Math.floor((today - last) / (1000 * 60 * 60 * 24));

        if (diff === 1) {
            newStreak = streak.current_streak + 1;
        }
    }

    const best = Math.max(newStreak, streak.best_streak);
    const updatePayload = {
        current_streak: newStreak,
        best_streak: best,
        last_activity_date: todayString,
        updated_at: new Date().toISOString()
    };

    console.log("Updating streak values:", updatePayload);

    const { data: updatedStreak, error } = await supabase
        .from("user_streaks")
        .update(updatePayload)
        .eq("user_id", streak.user_id)
        .select()
        .maybeSingle();

    if (error) {
        console.error("Update streak failure:", error);
        return null;
    }

    console.log("Update streak success:", updatedStreak);
    console.log("New streak data:", updatedStreak);
    console.log("Final streak values:", updatedStreak);
    refreshStreakUI(updatedStreak);
    return updatedStreak;
}

async function getStreak() {
    return await getUserStreak();
}

function attachAnalyzerCardHandlers() {
    const cards = document.querySelectorAll("a.analyzer-card[data-analyzer-card='true']");

    cards.forEach((card) => {
        if (card.dataset.streakBound === "true") {
            return;
        }

        if (!card.href) {
            return;
        }

        card.addEventListener("click", function (event) {
            console.log("Analyzer card clicked:", this.href);
            handleAnalyzerClick(event, this.href);
        });

        card.dataset.streakBound = "true";
    });
}

document.addEventListener("DOMContentLoaded", async () => {
    attachAnalyzerCardHandlers();

    const streak = await getStreak();

    if (streak) {
        refreshStreakUI(streak);
    }
});

async function handleAnalyzerClick(event, url) {
    event.preventDefault();

    try {
        await updateStreak();
        console.log("Navigation started:", url);
        window.location.href = url;
    } catch (err) {
        console.error("Failed to update streak:", err);
        console.log("Navigation started:", url);
        window.location.href = url;
    }
}