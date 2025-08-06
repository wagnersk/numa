import { StyleSheet } from "react-native"

import { colors, fontFamily } from "@/theme"

export const styles = StyleSheet.create({
    container : {
         width:'100%',
        alignItems:'flex-end',
        paddingHorizontal:24,
    },
    toogle : {
        borderRadius:48,
        backgroundColor:colors.gray[300],
        flexDirection:'row',
        padding:6,
        

    },
     actived : {
        backgroundColor:colors.white,
        paddingHorizontal:8,
        paddingVertical:4,
        borderRadius:24,
    },
    desactived : {
        backgroundColor:colors.gray[300],
        paddingHorizontal:8,
        paddingVertical:4,
        borderRadius:24
    }
 })