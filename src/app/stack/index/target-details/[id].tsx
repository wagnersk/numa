import { router, useFocusEffect } from "expo-router";
import { TouchableOpacity, ImageBackground, Alert } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { BlurView } from 'expo-blur';

 
import { colors } from "@/theme";
import AntDesign from '@expo/vector-icons/AntDesign';
import { styles } from "./styles";
import BlurViewTargetDetails from "@/components/BlurViewTargetDetails";
import { useCallback, useState } from "react";
import { useTargetDatabase } from "@/database/useTargetDatabase";
import { TartgetGridProps } from "@/components/TargetGrid";
import { numberToCurrency } from "@/utils/numberToCurrency";


export default function TargetDetail() {
    const params = useLocalSearchParams<{id: string}>();

    const [ target, setTarget ] = useState<TartgetGridProps>([])
    const [ isFetching, setIsFetching ] = useState(false)
    
         
        const targetDatabase = useTargetDatabase()
 

 

async function fetchTarget(): Promise<TartgetGridProps> {
  try {
    const response = await targetDatabase.show(params.id)
 
          return {
                 id:Number(response.id),
                target:numberToCurrency(response.amount),
                currency: numberToCurrency(response.current),
                color: response.color,
                end_date: response.end_date,
                name: response.name,
                percentage: Number(response.percentage.toFixed(2)),
                current:response.current,
                photo_url: response.photo_url,
                start_date: response.start_date,
          }
        } catch (error) {
          Alert.alert('Erro', 'Não foi possível carregar as metas.')
          console.log(error)
        }
      }
    
      async function fetchData() {
        const targetDataPromise = fetchTarget()
    
        const [targetData] = await Promise.all([
          targetDataPromise,
        ])
    
        setTarget(targetData)
        setIsFetching(false)
      }
    
      useFocusEffect(
        useCallback(() => {
          fetchData()
        }, []),
    )
 
    return (
          <ImageBackground
            source={{ uri: target.photo_url }}
            style={styles.container}
            resizeMode="cover"
        >
               <BlurView intensity={100} style={styles.backButon}>
                    <TouchableOpacity onPress={router.back}>
                        <AntDesign name="arrowleft" size={24} color={colors.white}/>
                    </TouchableOpacity>
               </BlurView>
              
               <BlurViewTargetDetails 
                    id={params.id}
                    data={target}
                    />
                       
        </ImageBackground>
    );
}

 
