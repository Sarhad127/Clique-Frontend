export async function saveUsername(newUsername, token) {
    try {
        const response = await fetch("http://localhost:8080/user/username", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify({ username: newUsername }),
        });

        if (!response.ok) {
            throw new Error("Failed to update username");
        }

        const updatedUser = await response.json();
        return updatedUser;
    } catch (error) {
        throw error;
    }
}

export async function saveDescription(desc, token) {
    try {
        const response = await fetch(`http://localhost:8080/user/description`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify({ description: desc }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Failed to save description");
        }

        return data;
    } catch (error) {
        throw error;
    }
}

export async function fetchChats(token) {
    try {
        const response = await fetch(`http://localhost:8080/api/chats`, {
            headers: {
                "Authorization": `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error("Failed to fetch chats");
        }

        const chats = await response.json();
        return chats;
    } catch (error) {
        throw error;
    }
}

export async function startChatWithFriend(friendId, token) {
    try {
        const response = await fetch(
            `http://localhost:8080/api/chats/start?friendId=${friendId}`,
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        if (!response.ok) {
            throw new Error("Failed to create chat");
        }

        const chatData = await response.json();
        return chatData;
    } catch (error) {
        throw error;
    }
}

export async function inviteUserToGroup(groupId, userIdentifier, token) {
    const response = await fetch(`http://localhost:8080/api/groups/${groupId}/invite`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ userIdentifier }),
    });
    const text = await response.text();

    if (!response.ok) {
        let errorMessage = "Failed to invite user";
        try {
            const errorData = JSON.parse(text);
            errorMessage = errorData.message || errorMessage;
        } catch {}
        throw new Error(errorMessage);
    }

    if (!text) {
        return null;
    }

    return JSON.parse(text);
}

