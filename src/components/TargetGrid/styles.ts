import { StyleSheet } from "react-native"

import { colors, fontFamily } from "@/theme"

export const styles = StyleSheet.create({
    container : {
        width:'100%',
        alignItems:'flex-end',
        paddingHorizontal:24,
    },
    toggleTrack: {
        borderRadius: 16,
        backgroundColor: colors.gray[300],
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingLeft: 14,
        paddingRight: 12,
        
    },
     toggleCircle: {
        width: 44,
        height: 28,
        borderRadius: 14,
        backgroundColor: colors.white,
        justifyContent: "center",
        alignItems: "center",
        shadowColor: colors.white,
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
        position: "absolute",
        left: 0,
        
    },
 })