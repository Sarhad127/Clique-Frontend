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
        body: JSON.stringify({ userIdentifier: userIdentifier }),
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

export async function fetchMessages(userId, friendId, token) {
    try {
        const response = await fetch(
            `http://localhost:8080/messages?userId=${userId}&friendId=${friendId}`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        throw error;
    }
}

export async function addFriend(identifier, token) {
    if (!identifier.trim()) {
        throw new Error("Please enter a username or email.");
    }

    try {
        const response = await fetch(
            `http://localhost:8080/friends/add?identifier=${encodeURIComponent(identifier)}`,
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        const message = await response.text();

        if (!response.ok) {
            throw new Error(message || "Failed to add friend");
        }

        return message;
    } catch (error) {
        throw error;
    }
}

export async function sendForgotPasswordEmail(email) {
    if (!email) {
        throw new Error("Please enter your email");
    }

    try {
        const response = await fetch("http://localhost:8080/auth/forgot-password", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email }),
        });

        if (!response.ok) {
            const data = await response.json();
            throw new Error(data || "Error sending reset email");
        }

        return "Password reset email sent. Please check your inbox.";
    } catch (error) {
        throw error;
    }
}

export async function fetchGroupMessages(groupId, token) {
    if (!groupId) throw new Error("Group ID is required");

    const response = await fetch(`http://localhost:8080/messages/group?groupId=${groupId}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
}

export async function fetchGroups(token) {
    const response = await fetch("http://localhost:8080/api/groups", {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch groups, status: ${response.status}`);
    }

    return response.json();
}

export async function createGroup(groupTitle, token) {
    if (!groupTitle.trim()) throw new Error("Group title cannot be empty");

    const response = await fetch("http://localhost:8080/api/groups", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
            title: groupTitle,
            userIds: [],
        }),
    });

    if (!response.ok) {
        throw new Error(`Failed to create group, status: ${response.status}`);
    }

    return response.json();
}

export async function updateAvatar({ avatarUrl, avatarColor, avatarInitials }, token) {
    const response = await fetch("http://localhost:8080/user/avatar", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
            avatarUrl: avatarUrl.trim(),
            avatarColor: avatarColor.trim(),
            avatarInitials: avatarInitials.trim(),
        }),
    });

    if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to update avatar");
    }

    return response.json();
}

export async function checkEmailAvailability(email) {
    const response = await fetch(`http://localhost:8080/auth/check-email?email=${encodeURIComponent(email)}`);

    if (!response.ok) {
        throw new Error("Failed to check email availability");
    }

    return response.json();
}

export async function registerUser({ email, username, password }) {
    const response = await fetch("http://localhost:8080/auth/signup", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, username, password }),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Registration failed");
    }

    return response.json();
}

export async function resetPassword(token, newPassword) {
    const response = await fetch("http://localhost:8080/auth/reset-password", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ token, newPassword }),
    });

    if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to reset password.");
    }

    return response.json();
}

export async function fetchUser(token) {
    const response = await fetch("http://localhost:8080/user", {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        throw new Error("Unauthorized or failed to fetch user");
    }

    return response.json();
}

export async function loginUser(email, password) {
    const payload = { email, password };
    const response = await fetch('http://localhost:8080/auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        const errorData = await response.json();
        const error = new Error('Login failed');
        error.code = errorData.error;
        throw error;
    }

    return response.json();
}

export async function deleteChat(chatId, token) {
    const response = await fetch(`http://localhost:8080/api/chats/${chatId}`, {
        method: "DELETE",
        headers: {
            "Authorization": `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        throw new Error(`Failed to delete chat (status ${response.status})`);
    }
    if (response.status === 204) {
        return null;
    }
    return response.text();
}

export async function leaveGroup(groupId, token) {
    const response = await fetch(`http://localhost:8080/api/groups/${groupId}/leave`, {
        method: "DELETE",
        headers: {
            "Authorization": `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        throw new Error(`Failed to leave group (status ${response.status})`);
    }

    if (response.status === 204) {
        return null;
    }
    return response.json();
}

export const updateGroupBackgroundImage = async (groupId, imageUrl, token) => {
    const response = await fetch(`http://localhost:8080/api/groups/${groupId}/background`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ backgroundImageUrl: imageUrl }),
    });

    if (!response.ok) {
        throw new Error("Failed to update group background.");
    }

    return await response.json();
};

export async function removeFriend(identifier, token) {
    const response = await fetch(`http://localhost:8080/friends/remove?identifier=${encodeURIComponent(identifier)}`, {
        method: "DELETE",
        headers: {
            "Authorization": `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to remove friend: ${errorText}`);
    }

    return response.text();
}