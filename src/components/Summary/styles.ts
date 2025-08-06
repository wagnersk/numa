import { StyleSheet } from "react-native"

import { colors, fontFamily } from "@/theme"

export const styles = StyleSheet.create({
    container : {
        width:"100%",
        padding:24,

  
    },
     infoWrapper : {
        flexDirection:'row',
        justifyContent:"space-between",
    },
     valueWrapper : {
        alignItems:"center"
    },
    value : {
        fontSize: 32,
        color: colors.black,
        fontFamily: fontFamily.regular
    },
      caption : {
        fontSize: 14,
        color: colors.black,
        fontFamily: fontFamily.regular
    }
 })