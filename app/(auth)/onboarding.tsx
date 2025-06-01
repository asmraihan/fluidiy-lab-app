import { router } from "expo-router";
import { useRef, useState } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Swiper from "react-native-swiper";

const onboardingData = [
	{
		id: 1,
		title: "Urinalysis Made Simple",
		description:
			"Get accurate urinalysis results instantly with our advanced AI-powered analysis",
		image: "https://images.pexels.com/photos/4021775/pexels-photo-4021775.jpeg",
	},
	{
		id: 2,
		title: "Fast & Accurate Results",
		description:
			"Our AI technology delivers precise results in seconds, making testing easier than ever",
		image: "https://images.pexels.com/photos/4226119/pexels-photo-4226119.jpeg",
	},
	{
		id: 3,
		title: "Professional Healthcare",
		description:
			"Trust in our medical-grade analysis for reliable health monitoring",
		image: "https://images.pexels.com/photos/4226122/pexels-photo-4226122.jpeg",
	},
];

export default function OnboardingScreen() {
	const swiperRef = useRef<Swiper>(null);
	const [activeIndex, setActiveIndex] = useState(0);

	const isLastSlide = activeIndex === onboardingData.length - 1;

	return (
		<SafeAreaView className="flex-1 bg-white">
			<TouchableOpacity
				onPress={() => router.push("/signin")}
				className="w-full flex items-end p-5"
			>
				<Text className="font-inter-bold text-black text-md">Skip</Text>
			</TouchableOpacity>

			<Swiper
				ref={swiperRef}
				loop={false}
				dot={
					<View className="w-[32px] h-[4px] mx-1 bg-[#E2E8F0] rounded-full" />
				}
				activeDot={
					<View className="w-[32px] h-[4px] mx-1 bg-primary rounded-full" />
				}
				onIndexChanged={(index) => setActiveIndex(index)}
			>
				{onboardingData.map((item) => (
					<View
						key={item.id}
						className="flex items-center justify-center p-5"
					>
						<Image
							source={{ uri: item.image }}
							className="w-full h-[300px]"
							resizeMode="contain"
						/>
						<View className="flex flex-row items-center justify-center w-full mt-10">
							<Text className="font-inter-bold text-3xl text-gray-900 text-center mx-10">
								{item.title}
							</Text>
						</View>
						<Text className="font-inter-medium text-lg text-gray-600 text-center mx-10 mt-3">
							{item.description}
						</Text>
					</View>
				))}
			</Swiper>

			<TouchableOpacity
				className="bg-primary mx-4 py-4 rounded-xl flex-row items-center justify-center mb-5"
				onPress={() =>
					isLastSlide
						? router.push("/signin")
						: swiperRef.current?.scrollBy(1)
				}
			>
				<Text className="font-inter-medium text-white text-lg">
					{isLastSlide ? "Get Started" : "Next"}
				</Text>
			</TouchableOpacity>
		</SafeAreaView>
	);
}