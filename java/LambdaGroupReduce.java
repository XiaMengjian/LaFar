package cn.raiyee.ec.admin.biz.activityAnalysis.service;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.function.Function;
import java.util.stream.Collectors;

@Slf4j
public class LambdaGroupReduce {


    public static void main(String[] args) {
        List<Activity> activities = new ArrayList<>();
        activities.add(Activity.builder().id("1").pv(1).uv(1).build());
        activities.add(Activity.builder().id("1").pv(10).uv(13).build());
        activities.add(Activity.builder().id("2").pv(2).uv(2).build());
        activities.add(Activity.builder().id("3").pv(3).uv(3).build());
        activities.add(Activity.builder().id("4").pv(4).uv(4).build());

        // toMap
        Map<String, Activity> demo1 = activities.parallelStream().collect(Collectors.toMap(Activity::getId, Function.identity(),
                (x, y) -> Activity.builder()
                        .id(x.getId())
                        .pv(x.getPv() + y.getPv())
                        .uv(x.getUv() + y.getUv())
                        .build()));


        // collectingAndThen + reduce
        Map<String, Activity> demo2 = activities.parallelStream().collect(Collectors.groupingBy(Activity::getId,
                Collectors.collectingAndThen(Collectors.reducing(
                        (x, y) -> Activity.builder()
                                .id(x.getId())
                                .pv(x.getPv() + y.getPv())
                                .uv(x.getUv() + y.getUv())
                                .build()),
                        Optional::get)));


        log.info("demo1 {}", demo1);
        log.info("demo2 {}", demo2);

        // demo1 {1=LambdaGroupReduce.Activity(id=1, pv=11, uv=14), 2=LambdaGroupReduce.Activity(id=2, pv=2, uv=2), 3=LambdaGroupReduce.Activity(id=3, pv=3, uv=3), 4=LambdaGroupReduce.Activity(id=4, pv=4, uv=4)}
        // demo2 {1=LambdaGroupReduce.Activity(id=1, pv=11, uv=14), 2=LambdaGroupReduce.Activity(id=2, pv=2, uv=2), 3=LambdaGroupReduce.Activity(id=3, pv=3, uv=3), 4=LambdaGroupReduce.Activity(id=4, pv=4, uv=4)}
    }

    @Data
    @Builder(toBuilder = true)
    @NoArgsConstructor
    @AllArgsConstructor
    static class Activity {

        String id;
        long pv;
        long uv;
    }

}
