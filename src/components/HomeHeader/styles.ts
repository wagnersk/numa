import { StyleSheet } from "react-native"

import { colors, fontFamily } from "@/theme"

export const styles = StyleSheet.create({
    container : {
        width:"100%",
        height:156,
        backgroundColor: colors.gray[300],
        justifyContent:'flex-end',
  
    },
     infoWrapper : {
        flexDirection:'row',
        width:'100%',
        alignItems:'center',
        justifyContent:'space-between',
        padding:24,
        gap:24,
    },
     greetings : {
        fontSize: 24,
        color: colors.black,
        fontFamily: fontFamily.regular
    },
    label : {
        fontSize: 40,
        color: colors.black,
        fontFamily: fontFamily.medium
    },
    iconContainer : {
        height:48,
        width:48,
    },
 })