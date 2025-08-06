import { StyleSheet } from "react-native"

import { colors, fontFamily } from "@/theme"

export const styles = StyleSheet.create({
    container : {
        flex:1,
        padding:24,
        justifyContent:'center',
        alignItems:'center'
    },
    flatListStyle : {
        gap:24,
    
    },
    content : {
        backgroundColor:colors.red[400],
        flexDirection:'row',
        flexWrap:"wrap",
        gap:24,
  
    
    },
    targetItem : {
        borderRadius:12,
        height:140,
        width:140,
        backgroundColor:colors.gray[300],
        flexDirection:'row',
        padding:6,
        

    }
 })