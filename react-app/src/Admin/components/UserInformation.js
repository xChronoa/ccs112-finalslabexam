import React from "react";

const UserInformation = ({ user, removeUser, onUpdateClick }) => {
    return (
        <tr className="text-center">
            <td className="align-middle">{user.id}</td>
            <td className="align-middle">{user.name}</td>
            <td className="align-middle">{user.email}</td>
            <td className="align-middle">{user.password}</td>
            <td className="align-middle">{user.role}</td>
            <td className="align-middle">
                <div className="d-flex gap-2 justify-content-center">
                    {user.id != 1 ? (
                        <>
                            <button
                                onClick={() => onUpdateClick(user)}
                                className="btn btn-primary"
                            >
                                Update
                            </button>
                            <button
                                onClick={() => removeUser(user.id)}
                                className="btn btn-danger"
                            >
                                Delete
                            </button>
                        </>
                    ) : (
                        <>
                        </>
                    )}
                    
                </div>
            </td>
        </tr>
    );
};

export default UserInformation;