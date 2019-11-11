import React from "react";
import { Dimensions, Image, StyleSheet, Text, View } from "react-native";
import Animated, { Easing } from "react-native-reanimated";
import {
  PanGestureHandler,
  State,
  TapGestureHandler
} from "react-native-gesture-handler";
import { useMemoOne } from "use-memo-one";
import { EvilIcons, Feather } from "@expo/vector-icons";
import { people } from "../assets/data/people";

const {
  timing,
  eq,
  neq,
  block,
  Value,
  cond,
  set,
  event,
  add,
  and,
  clockRunning,
  not,
  startClock,
  stopClock,
  Clock,
  debug,
  decay,
  call,
  sub,
  spring,
  diffClamp,
  greaterOrEq,
  lessOrEq,
  greaterThan,
  lessThan,
  multiply,
  concat
} = Animated;

const BottomCard = props => {
  const { gestureState, cardTransX, cardTransY, cardVelX } = useMemoOne(
    () => ({
      gestureState: new Value(State.UNDETERMINED),
      cardTransX: new Value(0),
      cardTransY: new Value(0),
      cardVelX: new Value(0)
    }),
    []
  );

  const handlePan = event([
    {
      nativeEvent: ({ state, translationX, translationY, velocityX }) =>
        block([
          set(gestureState, state),
          set(cardTransX, translationX),
          set(cardTransY, translationY),
          set(cardVelX, velocityX)
        ])
    }
  ]);

  const withSpring = (
    gestureState: Animated.Value<State>,
    value: Animated.Value<number>,
    vel: Animated.Value<number>
  ) => {
    const clock = new Clock();
    const offset = new Value(0);
    const state = {
      finished: new Value(0),
      position: new Value(0),
      velocity: new Value(0),
      time: new Value(0)
    };
    const config = {
      stiffness: new Value(100),
      mass: new Value(1),
      damping: new Value(10),
      overshootClamping: false,
      restSpeedThreshold: 0.001,
      restDisplacementThreshold: 0.001,
      toValue: new Value(0)
    };
  
    return block([
      cond(neq(gestureState, State.END), [
        set(state.finished, 0),
        set(state.position, add(offset, value))
      ]),
      cond(eq(gestureState, State.END), [
        cond(and(not(clockRunning(clock)), not(state.finished)), [
          set(state.time, 0),
          set(state.velocity, vel),
          // TO VALUE IS 0 FOR BOTH
          set(config.toValue, 0),
          startClock(clock)
        ]),
        spring(clock, state, config),
        set(offset, state.position),
        cond(state.finished, [stopClock(clock)])
      ]),
      state.position
    ]);
  };

  const cardTransXSpring = withSpring(gestureState, cardTransX, cardVelX);
  const cardTransYSpring = withSpring(gestureState, cardTransY, cardVelX);

  const rotateVal = Animated.interpolate(cardTransXSpring, {
    inputRange: [-100, 100],
    outputRange: [-6, 6]
  });
  const backScaleVal = Animated.interpolate(cardTransXSpring, {
    inputRange: [-300, 0, 300],
    outputRange: [1, 0.8, 1]
  });

  return (
    <View style={{ ...styles.container }}>
      <View style={{ ...styles.topHeader }}>
        <Text
          style={{
            color: "white",
            marginTop: 25,
            fontSize: 22,
            fontFamily: "Roboto-Light"
          }}
        >
          Tinder
        </Text>
      </View>
      <View style={{ ...styles.header }}>
        <Feather
          style={{ marginLeft: 20 }}
          name="user"
          size={32}
          color="gray"
        />
        <Feather
          style={{ marginRight: 20 }}
          name="message-circle"
          size={32}
          color="gray"
        />
      </View>
      <View style={{ ...styles.cardContainer }}>
        {people.map((person, index) => (
          <React.Fragment key={person.id}>
            <PanGestureHandler
              onGestureEvent={handlePan}
              onHandlerStateChange={handlePan}
            >
              <Animated.View
                style={[
                  styles.card,
                  {
                    transform: [
                      {
                        translateX:
                          index === people.length - 1 ? cardTransXSpring : 0
                      },
                      {
                        translateY:
                          index === people.length - 1 ? cardTransYSpring : 0
                      },
                      {
                        rotate:
                          index === people.length - 1
                            ? concat(rotateVal, "deg")
                            : "0deg"
                      },
                      {
                        scale: index !== people.length - 1 ? backScaleVal : 1
                      }
                    ]
                  }
                ]}
              >
                <Image
                  style={{ height: "100%", width: "100%", borderRadius: 10 }}
                  source={person.image}
                />
                <View style={{ position: "absolute", bottom: 30, left: 20 }}>
                  <Text
                    style={{
                      color: "#f7f7f7",
                      fontSize: 45,
                      fontFamily: "Roboto-Thin"
                    }}
                  >
                    {person.name}
                  </Text>
                  <Text
                    style={{
                      color: "#f7f7f7",
                      fontSize: 40,
                      fontFamily: "Roboto-Thin"
                    }}
                  >
                    {person.age}
                  </Text>
                </View>
              </Animated.View>
            </PanGestureHandler>
          </React.Fragment>
        ))}
      </View>
      <View style={{ ...styles.footer }}>
        <View style={{ ...styles.likeButton }}>
          <EvilIcons name="heart" size={50} color="#66bb6a" />
        </View>
        <View style={{ ...styles.dislikeButton }}>
          <EvilIcons name="close" size={50} color="#e53935" />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  topHeader: {
    height: 90,
    width: Dimensions.get("window").width,
    backgroundColor: "#29b6f6",
    alignItems: "center",
    justifyContent: "center"
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 20
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginTop: 20
  },
  likeButton: {
    height: 80,
    width: 80,
    borderRadius: 40,
    backgroundColor: "#f7f7f7",
    justifyContent: "center",
    alignItems: "center"
  },
  dislikeButton: {
    height: 80,
    width: 80,
    borderRadius: 40,
    backgroundColor: "#f7f7f7",
    justifyContent: "center",
    alignItems: "center"
  },
  cardContainer: {
    width: Dimensions.get("window").width,
    height: (Dimensions.get("window").height * 13) / 20,
    justifyContent: "center",
    alignItems: "center"
  },
  card: {
    width: "90%",
    height: "100%",
    backgroundColor: "white",
    borderRadius: 10,
    position: "absolute",
    zIndex: 1000,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1
    },
    shadowOpacity: 0.37,
    shadowRadius: 7.49,

    elevation: 12
  }
});

export default BottomCard;
