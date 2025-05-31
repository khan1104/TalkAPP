import { useNavigation } from 'expo-router';
import React, { useState, useRef, useCallback } from 'react';
import { View, FlatList, Image, Dimensions, StyleSheet, Text, TouchableOpacity, Pressable, SafeAreaView, StatusBar } from 'react-native';
import { ZoomIn } from 'react-native-reanimated';
import Animated from 'react-native-reanimated';

const DATA = [
  { id: '0', source: require('../assets/images/firts1.png') },
  { id: '1', source: require('../assets/images/second (2).png') },
  { id: '2', source: require('../assets/images/third1.png') },
];

const { width } = Dimensions.get('window');

const Slider = () => {
  const navigation = useNavigation();
  const [currentSlide, setCurrentSlide] = useState(0);
  const flatListRef = useRef(null);

  // Memoize the function to handle viewable items
  const handleViewableItemsChanged = useCallback(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setCurrentSlide(viewableItems[0].index);
    }
  }, []);

  // Memoize the function to handle next slide
  const handleNextSlide = useCallback(() => {
    const nextIndex = (currentSlide + 1) % DATA.length;
    flatListRef.current.scrollToIndex({ index: nextIndex, animated: true });
    setCurrentSlide(nextIndex);
  }, [currentSlide]);

  // Handle "Get Started" press
  const handleGetStarted = useCallback(() => {
    navigation.replace('auth/login');
  }, [navigation]);

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#e6f7fa" />
      <SafeAreaView style={styles.container}>
        <FlatList
          data={DATA}
          keyExtractor={(item) => item.id}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onViewableItemsChanged={handleViewableItemsChanged}
          viewabilityConfig={{ viewAreaCoveragePercentThreshold: 50 }}
          ref={flatListRef}
          renderItem={({ item }) => (
            <Image source={item.source} style={styles.image} accessible={true} accessibilityLabel={`Slide ${item.id}`} />
          )}
        />

        <View style={styles.indicatorContainer}>
          {DATA.map((_, index) => (
            <View key={index} style={[styles.indicator, currentSlide === index && styles.activeIndicator]} />
          ))}
        </View>

        {currentSlide === DATA.length - 1 ? (
          <Animated.View entering={ZoomIn} style={styles.getStartedContainer}>
            <Pressable style={styles.getStartedButton} onPress={handleGetStarted}>
              <Text style={styles.getStartedText}>Get Started</Text>
            </Pressable>
          </Animated.View>
        ) : (
          <Pressable style={styles.arrowButton} onPress={handleNextSlide}>
            <Image source={require("../assets/images/right-arrow.png")} style={styles.arrowImage} />
          </Pressable>
        )}
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#e6f7fa",
  },
  image: {
    width,
    height: 530,
    marginTop: 40,
  },
  indicatorContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom:25,
  },
  indicator: {
    height: 4,
    width: 10,
    backgroundColor: "grey",
    marginHorizontal: 3,
    borderRadius: 5,
  },
  activeIndicator: {
    backgroundColor: "black",
    width: 20,
  },
  getStartedContainer: {
    height: 150,
    alignItems: "center",
  },
  arrowButton: {
    width: 100,
    height: 100,
    borderRadius: 100,
    padding: 25,
    marginLeft: 130,
    marginBottom: 50,
    backgroundColor: "#e6f7fa",
    elevation: 20,
    shadowColor: "black",
  },
  arrowImage: {
    height: 50,
    width: 50,
  },
  getStartedButton: {
    height: 65,
    width: 180,
    borderRadius: 20,
    backgroundColor: "#e6f7fa",
    elevation: 20,
    shadowColor: "black",
    justifyContent: "center",
    alignItems: "center",
  },
  getStartedText: {
    fontSize: 25,
    color: "black",
    fontWeight: "500",
    letterSpacing: 1,
  },
});

export default Slider;
