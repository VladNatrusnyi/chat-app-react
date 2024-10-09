import { FC, useContext, useEffect, useState, useMemo } from "react";
import { IUser } from "../../types";
import { Tabs } from "../UI/Tabs/Tabs";
import { ChatItem } from "../ChatItem/ChatItem";
import styles from "./ChatsList.module.scss";
import { auth } from "../../firebase.ts";
import { AppContext } from "../../context/AppContext/AppContext.tsx";
import { CustomInput } from "../UI/CustomInput/CustomInput.tsx";
import { botsConfig } from "../../mock/botsConfig.ts";

interface UserListProps {
    users: IUser[];
    selectedRecipientData: IUser | null;
    selectUser: (user: IUser) => void;
    isLoading: boolean;
    error: string | null;
}

export const ChatsList: FC<UserListProps> = ({
                                                       users,
                                                       selectedRecipientData,
                                                       selectUser,
                                                       isLoading,
                                                       error,
                                                   }) => {
    const [filteredUsers, setFilteredUsers] = useState<IUser[]>([]);
    const [activeTab, setActiveTab] = useState<number>(1);
    const [searchText, setSearchText] = useState<string>("");

    const context = useContext(AppContext);
    const { showSideBar } = context!;

    const senderUid = auth.currentUser?.uid;

    const combinedUsers = useMemo(() => [...botsConfig, ...users], [users, botsConfig]);

    useEffect(() => {
        let filtered = [...combinedUsers];

        if (activeTab === 1) {
            filtered = filtered.filter((user) => user.isOnline);
        }

        if (searchText.trim()) {
            filtered = filtered.filter((user) =>
                user.name.toLowerCase().includes(searchText.trim().toLowerCase())
            );
        }

        setFilteredUsers(filtered);
    }, [combinedUsers, activeTab, searchText]);

    return (
        <div className={`${styles.usersContainer} ${showSideBar ? styles.showUsers : ""}`}>
            <div className={styles.tabsWrapper}>
                <Tabs
                    tabs={[
                        { id: 1, label: "Online" },
                        { id: 2, label: "All" },
                    ]}
                    activeTab={activeTab}
                    onTabClick={setActiveTab}
                />
            </div>

            <div className={styles.usersListWrapper}>
                {isLoading ? (
                    <div className={styles.loadingContainer}>Loading...</div>
                ) : error ? (
                    <div className={styles.errorContainer}>{error}</div>
                ) : filteredUsers.length ? (
                    filteredUsers.map((user) => (
                        <ChatItem
                            key={user.uid}
                            user={user}
                            selectUser={selectUser}
                            senderUid={senderUid!}
                            selectedRecipientData={selectedRecipientData}
                        />
                    ))
                ) : (
                    <div className={styles.noUsersContainer}>No users found</div>
                )}
            </div>

            <div className={styles.searchWrapper}>
                <CustomInput
                    type="text"
                    name="search"
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    placeholder="Search..."
                />
            </div>
        </div>
    );
};
