import { StyleSheet } from "react-native"

import { colors, fontFamily } from "@/theme"

export const styles = StyleSheet.create({
    container : {
        justifyContent:'center',
        gap:8,
    },
    listWrapper : {
    },
    listItem: {
        borderRadius: 12,
        backgroundColor: colors.gray[300],
        height:240
    },
    bulletWrapper : {
       backgroundColor:'green',
       height:20,
       width:'100%',
       alignContent:'center',
       justifyContent:'center',
       
    },
 })

