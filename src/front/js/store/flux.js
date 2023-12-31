import { useNavigate } from "react-router-dom";

const baseApiUrl = process.env.BACKEND_URL || "http://10.0.5.2:3001";

const getState = ({ getStore, getActions, setStore }) => {
	return {
		store: {
			message: null,
			demo: [
				{
					title: "FIRST",
					background: "white",
					initial: "white"
				},
				{
					title: "SECOND",
					background: "white",
					initial: "white"
				}
			],
			accessToken: undefined,
			user: undefined,
			contact_requests: []
		},


		actions: {
			contact: async ({ name, email, phone, datatype, text }) => {
				try {
					const response = await fetch(`${baseApiUrl}/api/contact-requests`, {
						method: "POST",
						body: JSON.stringify({
							name: name,
							email: email,
							phone: phone,
							datatype: datatype,
							text: text,
						}),
						headers: {
							"Content-Type": "application/json"
						}
					});
			
					if (response.ok) {
						const body = await response.json();
						console.log("Contact request submitted successfully:", body);
					} else {
						throw new Error(`Failed to submit contact request. Status: ${response.status}, Message: ${response.statusText}`);
					}
				} catch (error) {
					console.error("Contact request error:", error);
					throw error; // rethrow the error to propagate it further
				}
			},



			logIn: async ({ email, hashed_password }) => {
				const response = await fetch(
					`${baseApiUrl}/api/log-in`, {
					method: "POST",
					body: JSON.stringify({
						email: email,
						hashed_password: hashed_password,
					}),
					headers: {
						"Content-Type": "application/json"
					}
				}
				)
				const body = await response.json();
				if (response.ok) {
					setStore({
						accessToken: body.access_token,
						user: body.user
					});
					console.log(body.user)
					localStorage.setItem("accessToken", body.access_token);
					localStorage.setItem("user", JSON.stringify(body.user));
					return true
				}
			}

			,


			logOut: () => {
				setStore({
					accessToken: undefined,
					user: undefined,
				});

				localStorage.removeItem("accessToken");
				localStorage.removeItem("user");

			},
			signUp: async ({ email, hashed_password, name, phone}) => {
				const response = await fetch(`${baseApiUrl}/api/sign-up`, {
					method: "POST",
					body: JSON.stringify({
						email: email,
						hashed_password: hashed_password,
						name: name,
						phone: phone
					}),
					headers: {
						"Content-Type": "application/json",
					},
				});

				if (response.ok) {
					const body = await response.json();
					setStore({
						accessToken: body.access_token,
						user: body.user,
					});

					localStorage.setItem("accessToken", body.access_token);
					localStorage.setItem("user", JSON.stringify(body.user));
				}

				return response;
			},
			loadSomeData: () => {
				fetch("www.thecocktaildb.com/api/json/v1/1/search.php?f=a")
					.then((response) => response.json())
					.then((data) => {
						console.log(data)
						setStore({ cocktails: data.results })
					})
			},
			resetPassword: async ({ email, newPassword, token }) => {
                try {
                    const response = await fetch(`${baseApiUrl}/api/reset_password`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            email: email,
                            new_password: newPassword,
                            token: token,
                        })
                    });
                    if (response.ok) {
                        const data = await response.json();
                        console.log("Password reset successfully", data);
                        // Additional logic here, like redirecting the user
                        return data;
                    } else {
                        console.error("Failed to reset password: ", response.status, response.statusText);
                        throw new Error('Failed to reset password');
                    }
                } catch (error) {
                    console.error("Error resetting password:", error);
                }
            },


			getMessage: async () => {
				try {

					const resp = await fetch(process.env.BACKEND_URL + "/api/hello")
					const data = await resp.json()
					setStore({ message: data.message })

					return data;
				} catch (error) {
					console.log("Error loading message from backend", error)
				}
			},
			changeColor: (index, color) => {

				const store = getStore();


				const demo = store.demo.map((elm, i) => {
					if (i === index) elm.background = color;
					return elm;
				});


				setStore({ demo: demo });
			}
		}
	};
};

export default getState;